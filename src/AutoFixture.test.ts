import AutoFixture, { IAutoFixture } from './AutoFixture';

describe('AutoFixture', () => {
  const GUID_REGEX = /^[A-F0-9]{8}(?:-[A-F0-9]{4}){3}-[A-F0-9]{12}$/i;

  let fixture: IAutoFixture;

  beforeEach(() => {
    fixture = new AutoFixture();
  });

  test('create when given a string creates a random string prefixed by the provided string', () => {
    const prefix = 'foo';
    expect(fixture.create(prefix)).toMatch(/foo.+/);
  });

  test('create when given the String constructor creates a random string (that happens to be a GUID)', () => {
    expect(fixture.create(String)).toMatch(GUID_REGEX);
  });

  test('create when given the Number constructor creates a random number', () => {
    expect(fixture.create(Number)).toEqual(expect.any(Number));
  });

  test('create when given the Boolean constructor creates either true or false', () => {
    expect(fixture.create(Boolean)).toEqual(expect.any(Boolean));
  });

  test('create when given a function uses that function to create an instance', () => {
    interface ISample {
      sample: string;
    }

    function fooBar(): ISample {
      return { sample: '' };
    }

    const instance = fixture.create<ISample>(fooBar);
    expect(instance).toBeDefined();
    expect(instance.sample).toBeDefined();
  });

  [
    ['null', null],
    ['undefined', undefined],
  ].forEach(testCase => {
    it(`create when given a function that returns ${testCase[0]} throws an error`, () => {
      function fooBar() {
        return testCase[1];
      }
      expect(() => {
        fixture.create(fooBar);
      }).toThrowError(/Unable to create instance using factory function/i);
    });
  });

  it('create when given a constructor function that fails throws an error', () => {
    function FooBar() {
      throw new Error('Failed!');
    }
    expect(() => {
      fixture.create(FooBar);
    }).toThrowError(/Unable to create instance of FooBar/i);
  });

  it('create when given the Boolean constructor generates a random true or false value', () => {
    const dict: {
      [index: number]: boolean;
    } = {};

    for (let i = 0; i < 100 && (!dict[1] || !dict[0]); ++i) {
      const prop = fixture.create<boolean>(Boolean) ? 1 : 0;
      dict[prop] = true;
    }
    expect(dict[1]).toBeTruthy();
    expect(dict[0]).toBeTruthy();
  });

  [true, false].forEach(testCase => {
    it(`creates a random boolean value when given a ${testCase} seed boolean`, () => {
      const dict: { [index: number]: number } = {};
      let result: number;
      const COUNT = 2000;

      for (let i = 0; i < COUNT; ++i) {
        result = fixture.create<boolean>(testCase) ? 1 : 0;
        dict[result] = dict[result] + 1 || 1;
      }
      // with many iterations we should start seeing the affects of
      // the uniform distribution with the average coming in around
      // 50% of the multiplier, so verify we're between 45 and 55%.
      expect(dict[1]).toBeGreaterThanOrEqual(0.45 * COUNT);
      expect(dict[1]).toBeLessThanOrEqual(0.55 * COUNT);
      expect(dict[0]).toBeGreaterThanOrEqual(0.45 * COUNT);
      expect(dict[0]).toBeLessThanOrEqual(0.55 * COUNT);
    });
  });

  it('creates a random number when given a seed number (multiplier)', () => {
    const seed = 123;
    const num = fixture.create(seed);
    expect(num).toBeGreaterThanOrEqual(0);
    expect(num).toBeLessThan(seed);
  });

  it('creates an object using the constructor function when passed a constructor function', () => {
    interface IMyObjectType {
      prop1: string;
      prop2: string;
      prop3: number;
      prop4: boolean;
    }

    function MyObjectType(this: IMyObjectType) {
      this.prop1 = '';
      this.prop2 = '';
      this.prop3 = 0;
      this.prop4 = false;
    }

    const obj = fixture.create<any>(MyObjectType);
    expect(obj.constructor.name).toEqual('MyObjectType');
  });

  it('creates an object with the same properties as the expected type with random values assigned to them', () => {
    interface IMyObjectType {
      prop1: string;
      prop2: string;
      prop3: number;
      prop4: boolean;
    }

    function MyObjectType(this: IMyObjectType) {
      this.prop1 = '';
      this.prop2 = '';
      this.prop3 = 0;
      this.prop4 = false;
    }

    const obj = fixture.create<IMyObjectType>(MyObjectType);
    expect(obj.prop1).toMatch(/prop1.+/);
    expect(obj.prop2).toMatch(/prop2.+/);
    expect(obj.prop3).not.toEqual(0);
    expect(obj.prop4 === true || obj.prop4 === false).toBeTruthy();
  });

  [
    [1, 0, 1],
    [5, 0, 5],
    [10, 0, 10],
    [50, 0, 50],
    [100, 0, 100],
    [1000, 0, 1000],
  ].forEach(testCase => {
    it(`create when given the Number constructor accepts a positive multiplier ({0})`, () => {
      const multiplier = testCase[0];
      const min = testCase[1];
      const max = testCase[2];

      const COUNT = 2000;
      let sum = 0;
      let average;

      for (let i = 0; i < COUNT; ++i) {
        const num = fixture.create<number>(Number, multiplier);
        expect(num).toBeGreaterThanOrEqual(min);
        expect(num).toBeLessThan(max);
        sum += num;
      }
      // with many iterations we should start seeing the affects of
      // the uniform distribution with the average coming in around
      // 50% of the multiplier, so verify we're between 45 and 55%.
      average = sum / COUNT;
      expect(average).toBeGreaterThan(0.45 * multiplier);
      expect(average).toBeLessThan(0.55 * multiplier);
    });
  });

  describe('createMany', () => {
    it('creates on average the expected number of instances', () => {
      const COUNT = 2000;
      const MIN = 3; // must change with implementation
      const MAX = 10; // must change with implementation
      const expectedAverage = MIN + (MAX - MIN) / 2;

      let result;
      let average;
      let lengthSum = 0;

      for (let i = 0; i < COUNT; ++i) {
        result = fixture.createMany(String);
        expect(result.length).toBeGreaterThanOrEqual(MIN);
        expect(result.length).toBeLessThanOrEqual(MAX);
        lengthSum += result.length;
      }

      // with many iterations we should start seeing the affects of
      // the uniform distribution with the average coming in within
      // 5% of the expected value.
      average = lengthSum / COUNT;
      expect(average).toBeGreaterThanOrEqual(0.95 * expectedAverage);
      expect(average).toBeLessThanOrEqual(1.05 * expectedAverage);
    });

    it('Create the number requested when provided', () => {
      const COUNT = 125;

      const result = fixture.createMany(String, COUNT);

      expect(result.length).toBe(COUNT);
    });
  });

  [
    // seed, min (inclusive), max (exclusive)
    [1, 0, 1],
    [5, 0, 5],
    [10, 0, 10],
    [50, 0, 50],
    [100, 0, 100],
    [1000, 0, 1000],
  ].forEach(testCase => {
    it(`create when given a positive seed number (${testCase[0]}) treats it as a positive multiplier`, () => {
      const seed = testCase[0];
      const min = testCase[1];
      const max = testCase[2];

      const COUNT = 2000;
      let sum = 0;
      let average;

      for (let i = 0; i < COUNT; ++i) {
        const num = fixture.create<number>(seed);
        expect(num).toBeGreaterThanOrEqual(min);
        expect(num).toBeLessThan(max);
        sum += num;
      }
      // with many iterations we should start seeing the affects of
      // the uniform distribution with the average coming in around
      // 50% of the multiplier, so verify we're between 45 and 55%.
      average = sum / COUNT;
      expect(average).toBeGreaterThan(0.45 * seed);
      expect(average).toBeLessThan(0.55 * seed);
    });
  });

  [
    // multiplier, min (exclusive), max (inclusive)
    [-1, -1, 0],
    [-5, -5, 0],
    [-10, -10, 0],
    [-50, -50, 0],
    [-100, -100, 0],
    [-1000, -1000, 0],
  ].forEach(testCase => {
    it(`create when given the Number constructor accepts a negative multiplier (${testCase[0]})`, () => {
      const multiplier = testCase[0];
      const min = testCase[1];
      const max = testCase[2];

      let sum = 0;
      let average;
      const COUNT = 2000;

      for (let i = 0; i < COUNT; ++i) {
        const num = fixture.create<number>(Number, multiplier);
        expect(num).toBeGreaterThan(min);
        expect(num).toBeLessThanOrEqual(max);
        sum += num;
      }

      // with many iterations we should start seeing the affects of
      // the uniform distribution with the average coming in around
      // 50% of the multiplier, so verify we're between 45 and 55%.
      average = sum / COUNT;
      expect(average).toBeGreaterThan(0.55 * multiplier);
      expect(average).toBeLessThan(0.45 * multiplier);
    });
  });

  [
    // seed, min (exclusive), max (inclusive)
    [-1, -1, 0],
    [-5, -5, 0],
    [-10, -10, 0],
    [-50, -50, 0],
    [-100, -100, 0],
    [-1000, -1000, 0],
  ].forEach(testCase => {
    it(`create when given a negative seed number (${testCase[0]}) treats it as a negative multiplier"`, () => {
      const seed = testCase[0];
      const min = testCase[1];
      const max = testCase[2];

      const COUNT = 2000;
      let sum = 0;
      let average;

      for (let i = 0; i < COUNT; ++i) {
        const num = fixture.create<number>(Number, seed);
        expect(num).toBeGreaterThan(min);
        expect(num).toBeLessThanOrEqual(max);
        sum += num;
      }
      // with many iterations we should start seeing the affects of
      // the uniform distribution with the average coming in around
      // 50% of the multiplier, so verify we're between 45 and 55%.
      average = sum / COUNT;
      expect(average).toBeGreaterThan(0.55 * seed);
      expect(average).toBeLessThan(0.45 * seed);
    });
  });

  [
    [
      () => {
        return fixture.create(String);
      },
      'String Constructor',
    ],
    [
      () => {
        return fixture.create('prefix');
      },
      'string prefix',
    ],
    [
      () => {
        return fixture.create(Number);
      },
      'Number Constructor',
    ],
    [
      () => {
        return fixture.create(123);
      },
      'seeded number',
    ],
  ].forEach(testCase => {
    it(`create with ${testCase[1]} does not return the same value when called multiple times`, () => {
      const factory = testCase[0] as () => string;

      const dict: { [index: string]: boolean } = {};
      let rand;

      for (let i = 0; i < 1000; ++i) {
        rand = factory();
        if (typeof dict[rand] !== 'undefined') {
          throw new Error(`GUID ${rand} created multiple times`);
        }
        dict[rand] = true;
      }
    });
  });
});
