define('AutoFixture', [], function () {
    'use strict';

    var isConstructorFunctionRx = /^[A-Z].*/,
        ctorRegex = new RegExp("^function\\s+([A-Z]\\S*)\\s+");

    function createGuid() {
        /*jslint bitwise: true */
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
        /*jslint bitwise: false */
    };

    function PrefixedStringSpecimenFactory() {
        this.handles = function(typeInfo) {
            return typeof typeInfo === 'string';
        };
        this.create = function(typeInfo) {
            return typeInfo + createGuid();
        };
    }

    function StringConstructorSpecimenFactory() {
        this.handles = function(typeInfo) {
            return typeof typeInfo === 'function' && typeInfo === String;
        }
        this.create = function(typeInfo) {
            return createGuid();
        }
    }

    function NumberConstructorSpecimenFactory() {
        this.handles = function(typeInfo) {
            return typeof typeInfo === 'function' && typeInfo === Number;
        }
        this.create = function (typeInfo, args) {
            var multiplier = 1;
            if (args.length > 0 && typeof args[0] === 'number') {
                multiplier = args[0];
            }
            return Math.random() * multiplier;
        }
    }

    function SeededNumberSpecimenFactory() {
        this.handles = function(typeInfo) {
            return typeof typeInfo === 'number';
        }
        this.create = function (typeInfo) {
            var multiplier = 1;
            if (typeof typeInfo === 'number' && typeInfo !== 0) {
                multiplier = typeInfo;
            }
            return Math.random() * multiplier;
        }
    }

    function BooleanSpecimenFactory() {
        this.handles = function(typeInfo) {
            return (typeof typeInfo === 'function' && typeInfo === Boolean)
                || (typeof typeInfo === 'boolean');
        }
        this.create = function (typeInfo) {
            return Math.random() < 0.5;
        }
    }


    function ObjectBuilder(fixture) {
        var self = this,
            withouts = {},
            withs = {},
            likeness = {},
            key;

        function isFunction(sample) {
            return sample !== null && typeof sample === 'function';
        }

        function isConstructorFunction(sample) {
            return sample.toString().match(ctorRegex) !== null;
        }

        function createInstanceOf(sample) {
            var instance = {};
            if (isConstructorFunction(sample)) {
                try {
                    return new sample();
                } catch (ex) {
                    throw new Error('Unable to create new instance: ' + ex.message);
                }
            } else if (isFunction(sample)) {
                try {
                    instance = sample();
                } catch (ex) {
                    throw new Error('Factory function failed: ' + ex.message);
                }
                if (instance === null || typeof instance === 'undefined') {
                    throw new Error('Factory function returned null or undefined');
                }
            }
            return instance;
        }

        function getLikenessInstance(sample) {
            if (isFunction(sample)) {
                return createInstanceOf(sample);
            }
            return sample;
        }

        this.create = function () {
            var likenessInstance = getLikenessInstance(likeness),
                result = createInstanceOf(likeness),
                i, keys;
            if (typeof likenessInstance !== 'undefined' && likenessInstance !== null) {
                keys = Object.keys(likenessInstance);
                for (i = 0; i < keys.length; ++i) {
                    key = keys[i];
                    if (!withouts.hasOwnProperty(key)) {
                        if (typeof likenessInstance[key] === 'string') {
                            result[key] = fixture.create(key);
                        } else {
                            result[key] = fixture.create(likenessInstance[key]);
                        }
                    }
                }
                keys = Object.keys(withs);
                for (i = 0; i < keys.length; ++i) {
                    key = keys[i];
                    result[key] = withs[key];
                }
            }
            return result;
        };

        this.like = function(instance) {
            likeness = instance || {};
            return self;
        };

        this.without = function(propName) {
            withouts[propName] = true;
            return self;
        };

        this["with"] = function(propName, propValue) {
            withs[propName] = propValue;
            return self;
        };
    }

    function ObjectSpecimenFactory(builderFactory) {
        this.handles = function(typeInfo) {
            return typeof typeInfo === 'object';
        };
        this.create = function (typeInfo) {
            return builderFactory().like(typeInfo).create();
        };
    }

    function ObjectConstructorSpecimenFactory(builderFactory) {
        var getName = function(typeInfo) {
            var name = typeInfo.name;
            if (typeof name === 'undefined' && typeof typeInfo === 'function') {
                var match = typeInfo.toString().match(ctorRegex);
                if (match !== null) {
                    return match[0];
                }
            }
            return name;
        };
        this.handles = function(typeInfo) {
            return typeof typeInfo === 'function' && isConstructorFunctionRx.test(typeInfo.name);
        };
        this.create = function(typeInfo) {
            try {
                return builderFactory().like(typeInfo).create();
            } catch (err) {
                throw new Error("Unable to create instance of " + getName(typeInfo));
            }
        };
    }

    function FactoryFunctionSpecimenFactory(builderFactory) {
        this.handles = function(typeInfo) {
            return typeof typeInfo === 'function';
        };
        this.create = function(typeInfo) {
            try {
                return builderFactory().like(typeInfo).create();
            } catch (err) {
                throw new Error("Unable to create instance using factory function");
            }
        };
    }



    function AutoFixture() {
        var self = this;

        function _builderFactory() {
            return new ObjectBuilder(self);
        }

        function _createInternal(typeInfo, providedArgs) {
            var i;
            for (i = 0; i < self.customizations.length; ++i) {
                if (self.customizations[i].handles(typeInfo)) {
                    // arguments isn't really an array, so get one
                    var args = Array.prototype.slice.call(providedArgs); 
                    return self.customizations[i].create(typeInfo, args.slice(1));
                }
            }
            throw new Error('Unsupported Specimen: ' + typeInfo);
        }

        function _getRandomInt(min, max) {
           return Math.floor(Math.random() * (max - min + 1)) + min; 
        }

        this.customizations = [
            new PrefixedStringSpecimenFactory(),
            new StringConstructorSpecimenFactory(),
            new NumberConstructorSpecimenFactory(),
            new SeededNumberSpecimenFactory(),
            new BooleanSpecimenFactory(),
            new ObjectConstructorSpecimenFactory(_builderFactory),
            new FactoryFunctionSpecimenFactory(_builderFactory),
            new ObjectSpecimenFactory(_builderFactory)
        ];

        this.create = function (typeInfo) {
            return _createInternal(typeInfo, arguments);
        };

        this.createMany = function(typeInfo) {
            var count = _getRandomInt(3, 10);
            var result = [];
            for (var i = 0; i < count; ++i) {
                result.push(_createInternal(typeInfo, arguments));
            }
            return result;
        };

        this.build = function() {
            return _builderFactory();
        };
    }

    return new AutoFixture();
});

