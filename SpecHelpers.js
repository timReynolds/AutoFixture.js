// jsHint directives
/* exported crossProduct */
/* exported using */

// see: https://github.com/pivotal/jasmine/wiki/Matchers
beforeEach(function() {
    jasmine.addMatchers({
        // oddly enough these don't exist by default
        toBeLessThanOrEqualTo: function(util, customEqualityMatchers) {
            return {
                compare: function(actual, expected) {
                    var pass = (actual <= expected);
                    return {
                        pass: pass,
                        message: 'expected ' + actual + ' to be less than or equal to ' + expected
                    };
                }
            }
        },
        toBeGreaterThanOrEqualTo: function(util, customEqualityMatchers) {
            return {
                compare: function(actual, expected) {
                    var pass = (actual >= expected);
                    return {
                        pass: pass,
                        message: 'expected ' + actual + ' to be greater than or equal to ' + expected
                    };
                }
            }
        },
        toFail: function(util, customEqualityMatchers) {
            return {
                compare: function(actual, msg) {
                    return {
                        pass: false,
                        message: 'Explicit test failure' + (msg ? ': ' + msg : "")
                    }
                }
            }
        }
    });
});

// Provides support for parameterized unit tests.
// see: https://github.com/jphpsf/jasmine-data-provider/blob/master/spec/SpecHelper.js
function using(values, func) {
    for (var i = 0, count = values.length; i < count; i++) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        func.apply(this, values[i]);
    }
}

function crossProduct(data1, data2, filterDups) {
    if (typeof filterDups === "undefined") {
        filterDups = false;
    }
    var results = [];
    var key1;
    var key2;
    for (key1 in data1) {
        // looking for a non-inherited integer index into a possibly sparse array
        if (data1.hasOwnProperty(key1) && /^0$|^[1-9]\d*$/.test(key1) && key1 <= 4294967294) {
            for (key2 in data2) {
                if (data2.hasOwnProperty(key2) && /^0$|^[1-9]\d*$/.test(key2) && key2 <= 4294967294) {
                    if (filterDups && data1[key1] !== data2[key2]) {
                        results.push([data1[key1], data2[key2]]);
                    }
                }
            }
        }
    }
    return results;
}
