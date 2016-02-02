// jsHint directives
/* global beforeEach, jasmine, it, describe, expect, spyOn */
/* global using */

/// <reference path="~/TestScripts/lib/jasmine.js"/>
/// <reference path="~/includes/CoreAPI/NIT.Require.js" />
/// <reference path="~/TestScripts/spec/SpecHelpers.js"/>
/// <reference path="~/TestScripts/spec/AutoFixture.js"/>

describe('AutoFixture', function() {
    var fixture = require('AutoFixture');
    var GUID_REGEX = /^[A-F0-9]{8}(?:-[A-F0-9]{4}){3}-[A-F0-9]{12}$/i;
    var NUMBER_REGEX = /^\d+\.?\d*$/;

    it('create when given a string creates a random string prefixed by the provided string', function () {
        var prefix = 'foo';
        expect(fixture.create(prefix)).toMatch(/foo.+/);
    });

    it('create when given the String constructor creates a random string (that happens to be a GUID)', function() {
        expect(fixture.create(String)).toMatch(GUID_REGEX);
    });

    it('create when given the Number constructor creates a random number', function() {
        expect(fixture.create(Number)).toMatch(NUMBER_REGEX);
    });

    it('create when given a function uses that function to create an instance', function () {
        function fooBar() { return { sample: '' }; }
        var instance = fixture.create(fooBar);
        expect(instance).toBeDefined();
        expect(instance.sample).toBeDefined();
    });

    using(
    [
        ["null", null],
        ["undefined", undefined]
    ], function(description, returnValue) {
        it('create when given a function that returns {0} throws an error'.format(description), function() {
            function fooBar() { return returnValue; }
            expect(function () { fixture.create(fooBar); })
                .toThrowError(/Unable to create instance using factory function/i);
        });
    });

    it('create when given a constructor function that fails throws an error', function() {
        function FooBar () {
            throw new Error('Failed!');
        };
        expect(function () { fixture.create(FooBar); })
            .toThrowError(/Unable to create instance of FooBar/i);
    });


    it('create when given the Boolean constructor generates a random true or false value', function () {
        var dict = {}, i;
        for (i = 0; i < 100 && (!dict[true] || !dict[false]); ++i) {
            dict[fixture.create(Boolean)] = true;
        }
        expect(dict[true]).toBeTruthy();
        expect(dict[false]).toBeTruthy();
    });

    using(
    [
        [true],
        [false]
    ], function(bool) {
        it('creates a random boolean value when given a {0} seed boolean'.format(bool), function () {
            var dict = {}, i, result, COUNT = 2000;
            for (i = 0; i < COUNT; ++i) {
                result = fixture.create(bool);
                dict[result] = (dict[result] + 1) || 1;
            }
            // with many iterations we should start seeing the affects of
            // the uniform distribution with the average coming in around
            // 50% of the multiplier, so verify we're between 45 and 55%.
            expect(dict[true]).toBeGreaterThanOrEqualTo(.45*COUNT);
            expect(dict[true]).toBeLessThanOrEqualTo(.55*COUNT);
            expect(dict[false]).toBeGreaterThanOrEqualTo(.45*COUNT);
            expect(dict[false]).toBeLessThanOrEqualTo(.55*COUNT);
        });
    });

    it('creates a random number when given a seed number (multiplier)', function () {
        var seed = 123;
        var num = fixture.create(seed);
        expect(num).toBeGreaterThanOrEqualTo(0);
        expect(num).toBeLessThan(seed);
    });


    it('creates an object using the constructor function when passed a constructor function', function() {
        function MyObjectType() {
            this.prop1 = '';
            this.prop2 = '';
            this.prop3 = 0;
            this.prop4 = false;
        }

        var obj = fixture.create(MyObjectType);
        expect(obj.constructor.name).toEqual('MyObjectType');
    });

    it('creates an object with the same properties as the expected type with random values assigned to them', function() {
        function MyObjectType() {
            this.prop1 = '';
            this.prop2 = '';
            this.prop3 = 0;
            this.prop4 = false;
        }

        var obj = fixture.create(MyObjectType);
        expect(obj.prop1).toMatch(/prop1.+/);
        expect(obj.prop2).toMatch(/prop2.+/);
        expect(obj.prop3).not.toEqual(0);
        expect(obj.prop4 === true || obj.prop4 === false).toBeTruthy();
    });

    using([
        // multiplier, min (inclusive), max (exclusive)
        [1, 0, 1],
        [5, 0, 5],
        [10, 0, 10],
        [50, 0, 50],
        [100, 0, 100],
        [1000, 0, 1000]
    ], function(multiplier, min, max) {
        it('create when given the Number constructor accepts a positive multiplier ({0})'.format(multiplier), function () {
            var i, sum = 0, COUNT = 2000, average;
            for (i = 0; i < COUNT;++i)
            {
                var num = fixture.create(Number, multiplier);
                expect(num).toBeGreaterThanOrEqualTo(min);
                expect(num).toBeLessThan(max);
                sum += num;
            }
            // with many iterations we should start seeing the affects of
            // the uniform distribution with the average coming in around
            // 50% of the multiplier, so verify we're between 45 and 55%.
            average = sum / COUNT;
            expect(average).toBeGreaterThan(.45 * multiplier);
            expect(average).toBeLessThan(.55 * multiplier);
        });
    });

    it('createMany creates on average the expected number of instances', function () {
        var result, i, average,
            lengthSum = 0,
            COUNT = 2000,
            MIN = 3, // must change with implementation
            MAX = 10,// must change with implementation
            expectedAverage = MIN + (MAX - MIN) / 2;
        for (i = 0; i < COUNT; ++i) {
            result = fixture.createMany(String);
            expect(result.length).toBeGreaterThanOrEqualTo(MIN);
            expect(result.length).toBeLessThanOrEqualTo(MAX);
            lengthSum += result.length;
        }

        // with many iterations we should start seeing the affects of
        // the uniform distribution with the average coming in within
        // 5% of the expected value.
        average = lengthSum / COUNT;
        expect(average).toBeGreaterThanOrEqualTo(.95 * expectedAverage);
        expect(average).toBeLessThanOrEqualTo(1.05 * expectedAverage);
    });

    using([
        // seed, min (inclusive), max (exclusive)
        [1, 0, 1],
        [5, 0, 5],
        [10, 0, 10],
        [50, 0, 50],
        [100, 0, 100],
        [1000, 0, 1000]
    ], function(seed, min, max) {
        it('create when given a positive seed number ({0}) treats it as a positive multiplier'.format(seed), function () {
            var i, sum = 0, COUNT = 2000, average;
            for (i = 0; i < COUNT;++i)
            {
                var num = fixture.create(seed);
                expect(num).toBeGreaterThanOrEqualTo(min);
                expect(num).toBeLessThan(max);
                sum += num;
            }
            // with many iterations we should start seeing the affects of
            // the uniform distribution with the average coming in around
            // 50% of the multiplier, so verify we're between 45 and 55%.
            average = sum / COUNT;
            expect(average).toBeGreaterThan(.45 * seed);
            expect(average).toBeLessThan(.55 * seed);
        });
    });


    using([
        // multiplier, min (exclusive), max (inclusive)
        [-1, -1, 0],
        [-5, -5, 0],
        [-10, -10, 0],
        [-50, -50, 0],
        [-100, -100, 0],
        [-1000, -1000, 0]
    ],  function(multiplier, min, max) {
        it('create when given the Number constructor accepts a negative multiplier ({0})'.format(multiplier), function () {
            var i, sum = 0, COUNT = 2000, average;
            for (i = 0; i < COUNT;++i)
            {
                var num = fixture.create(Number, multiplier);
                expect(num).toBeGreaterThan(min);
                expect(num).toBeLessThanOrEqualTo(max);
                sum += num;
            }
            // with many iterations we should start seeing the affects of
            // the uniform distribution with the average coming in around
            // 50% of the multiplier, so verify we're between 45 and 55%.
            average = sum / COUNT;
            expect(average).toBeGreaterThan(.55 * multiplier);
            expect(average).toBeLessThan(.45 * multiplier);
        });
    });

    using([
        // seed, min (exclusive), max (inclusive)
        [-1, -1, 0],
        [-5, -5, 0],
        [-10, -10, 0],
        [-50, -50, 0],
        [-100, -100, 0],
        [-1000, -1000, 0]
    ], function(seed, min, max) {
        it('create when given a negative seed number ({0}) treats it as a negative multiplier'.format(seed), function () {
            var i, sum = 0, COUNT = 2000, average;
            for (i = 0; i < COUNT;++i)
            {
                var num = fixture.create(Number, seed);
                expect(num).toBeGreaterThan(min);
                expect(num).toBeLessThanOrEqualTo(max);
                sum += num;
            }
            // with many iterations we should start seeing the affects of
            // the uniform distribution with the average coming in around
            // 50% of the multiplier, so verify we're between 45 and 55%.
            average = sum / COUNT;
            expect(average).toBeGreaterThan(.55 * seed);
            expect(average).toBeLessThan(.45 * seed);
        });
    });

    using([
        [function() { return fixture.create(String); }, 'String Constructor'],
        [function() { return fixture.create('prefix'); }, 'string prefix'],
        [function() { return fixture.create(Number); }, 'Number Constructor'],
        [function() { return fixture.create(123); }, 'seeded number']
    ], function(factory, description) {
        it('create with {0} does not return the same value when called multiple times'.format(description), function() {
            var dict = {}, i, rand;
            for (i = 0; i < 1000; ++i) {
                rand = factory();
                if (typeof dict[rand] !== 'undefined') {
                    throw new Error('GUID {0} created multiple times'.format(rand));
                }
                dict[rand] = true;
            }
        });
    });

    describe('ObjectBuilder', function() {

        it('build().create() returns a new object', function() {
            var o = fixture.build().create();
            expect(typeof o).toEqual('object');
        });

        describe('like()', function () {

            it('create() returns an object with the same properties as instance', function () {
                var instance = {
                    'abc': 'def',
                    'xyz': 123,
                    'lol': {}
                };
                var o = fixture.build().like(instance).create();
                expect(o.abc).toBeDefined();
                expect(o.xyz).toBeDefined();
                expect(o.lol).toBeDefined();
            });

            it('create() returns an object with property values as the same type as its likeness', function () {
                var instance = {
                    'str': 'def',
                    'num': 123,
                    'bool': false,
                    'obj': {}
                };
                var o = fixture.build().like(instance).create();
                expect(typeof o.str).toEqual('string');
                expect(typeof o.num).toEqual('number');
                expect(typeof o.bool).toEqual('boolean');
                expect(typeof o.obj).toEqual('object');
            });

            describe('without()', function() {

                it('create() returns an object without the specified property set', function () {
                    var instance = {
                        withme: 'abc',
                        withoutme: 123
                    };
                    var obj = fixture.build().like(instance).without('withoutme').create();
                    expect(obj.hasOwnProperty('withme')).toBeTruthy();
                    expect(obj.hasOwnProperty('withoutme')).toBeFalsy();
                });

                it('allows multiple properties to be ignored', function() {
                   var instance = {
                       key1: 'value1',
                       key2: 'value2',
                       key3: 'value3',
                       key4: 'value4',
                       key5: 'value1',
                       other1: 1,
                       other2: 3,
                       other3: false
                   };
                    var obj = fixture.build().like(instance)
                        .without('key1', 1)
                        .without('key2', 2)
                        .without('key3', 3)
                        .without('key4', 4)
                        .without('other2', 'three')
                        .create();
                    expect(obj.hasOwnProperty('key1')).toBeFalsy();
                    expect(obj.hasOwnProperty('key2')).toBeFalsy();
                    expect(obj.hasOwnProperty('key3')).toBeFalsy();
                    expect(obj.hasOwnProperty('key4')).toBeFalsy();
                    expect(obj.hasOwnProperty('other2')).toBeFalsy();
                });

                it('does not ignore properties that were not told to be ignored', function() {
                   var instance = {
                       key1: 'value1',
                       key2: 'value2',
                       key3: 'value3',
                       key4: 'value4',
                       key5: 'value1',
                       other1: 1,
                       other2: 3,
                       other3: false
                   };
                    var obj = fixture.build().like(instance)
                        .without('key1', 1)
                        .without('key2', 2)
                        .without('key3', 3)
                        .without('key4', 4)
                        .without('other2', 'three')
                        .create();

                    expect(obj.hasOwnProperty('key5')).toBeTruthy();
                    expect(obj.hasOwnProperty('other1')).toBeTruthy();
                    expect(obj.hasOwnProperty('other3')).toBeTruthy();
                });
            });

            describe('with()', function() {
                
                it('create() returns an object with the specified property set to the specified value', function () {
                    var instance = {
                        withme: 'abc',
                        withoutme: 123
                    };
                    var obj = fixture.build().like(instance)["with"]('withme', 42).create();
                    expect(obj.hasOwnProperty('withme')).toBeTruthy();
                    expect(obj.withme).toEqual(42);
                });

                it('overrides any specified withouts that may be present', function() {
                   var instance = {
                        prop: 'abc',
                        another: 123
                    };
                    var obj = fixture.build().like(instance).with('prop', 42).without('prop').create();
                    expect(obj.hasOwnProperty('prop')).toBeTruthy();
                    expect(obj.prop).toEqual(42);
                });

                it('allows multiple properties to be set to specific values', function() {
                   var instance = {
                       key1: 'value1',
                       key2: 'value2',
                       key3: 'value3',
                       key4: 'value4',
                       key5: 'value1',
                       other1: 1,
                       other2: 3,
                       other3: false
                   };
                    var obj = fixture.build().like(instance)
                        ["with"]('key1', 1)
                        ["with"]('key2', 2)
                        ["with"]('key3', 3)
                        ["with"]('key4', 4)
                        ["with"]('other2', 'three')
                        .create();
                    expect(obj.key1).toBe(1);
                    expect(obj.key2).toBe(2);
                    expect(obj.key3).toBe(3);
                    expect(obj.key4).toBe(4);
                    expect(obj.other2).toBe('three');
                    expect(obj.key5).not.toEqual('value1');
                    expect(obj.other1).not.toEqual('value1');
                });
            });
        });
    });
});