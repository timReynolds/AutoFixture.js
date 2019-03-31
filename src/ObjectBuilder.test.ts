import AutoFixture, { IAutoFixture } from "./AutoFixture";

describe("ObjectBuilder", () => {
  let fixture: IAutoFixture;

  beforeEach(() => {
    fixture = new AutoFixture();
  });

  it("build().create() returns a new object", () => {
    const o = fixture.build().create();
    expect(typeof o).toEqual("object");
  });

  describe("like()", () => {
    it("create() returns an object with the same properties as instance", () => {
      interface IInstance {
        abc: string;
        xyz: number;
        lol: object;
      }

      const instance = {
        abc: "def",
        xyz: 123,
        lol: {}
      };
      const o = fixture
        .build<IInstance>()
        .like(instance)
        .create();
      expect(o.abc).toBeDefined();
      expect(o.xyz).toBeDefined();
      expect(o.lol).toBeDefined();
    });

    it("create() returns an object with property values as the same type as its likeness", () => {
      interface IInstance {
        str: string;
        num: number;
        bool: boolean;
        obj: object;
      }

      const instance = {
        str: "def",
        num: 123,
        bool: false,
        obj: {}
      };

      const result = fixture
        .build<IInstance>()
        .like(instance)
        .create();

      expect(typeof result.str).toEqual("string");
      expect(typeof result.num).toEqual("number");
      expect(typeof result.bool).toEqual("boolean");
      expect(typeof result.obj).toEqual("object");
    });

    it("creates on average the expected number of instances", () => {
      const COUNT = 2000;
      const MIN = 3; // must change with implementation
      const MAX = 10; // must change with implementation
      const expectedAverage = MIN + (MAX - MIN) / 2;

      const instance = {
        str: "def",
        num: 123,
        bool: false,
        obj: {}
      };

      let result;
      let average;
      let lengthSum = 0;

      for (let i = 0; i < COUNT; ++i) {
        result = fixture
          .build()
          .like(instance)
          .createMany();

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

    it("Create the number requested when provided", () => {
      const COUNT = 125;
      const instance = {
        str: "def",
        num: 123,
        bool: false,
        obj: {}
      };

      const result = fixture
        .build()
        .like(instance)
        .createMany(COUNT);

      expect(result.length).toBe(COUNT);
    });

    describe("without()", () => {
      it("create() returns an object without the specified property set", () => {
        const instance = {
          withme: "abc",
          withoutme: 123
        };

        const result = fixture
          .build()
          .like(instance)
          .without("withoutme")
          .create();

        expect(result.hasOwnProperty("withme")).toBeTruthy();
        expect(result.hasOwnProperty("withoutme")).toBeFalsy();
      });

      it("allows multiple properties to be ignored", () => {
        const instance = {
          key1: "value1",
          key2: "value2",
          key3: "value3",
          key4: "value4",
          key5: "value1",
          other1: 1,
          other2: 3,
          other3: false
        };

        const result = fixture
          .build()
          .like(instance)
          .without("key1")
          .without("key2")
          .without("key3")
          .without("key4")
          .without("other2")
          .create();

        expect(result.hasOwnProperty("key1")).toBeFalsy();
        expect(result.hasOwnProperty("key2")).toBeFalsy();
        expect(result.hasOwnProperty("key3")).toBeFalsy();
        expect(result.hasOwnProperty("key4")).toBeFalsy();
        expect(result.hasOwnProperty("other2")).toBeFalsy();
      });

      it("does not ignore properties that were not told to be ignored", () => {
        const instance = {
          key1: "value1",
          key2: "value2",
          key3: "value3",
          key4: "value4",
          key5: "value1",
          other1: 1,
          other2: 3,
          other3: false
        };

        const result = fixture
          .build()
          .like(instance)
          .without("key1")
          .without("key2")
          .without("key3")
          .without("key4")
          .without("other2")
          .create();

        expect(result.hasOwnProperty("key5")).toBeTruthy();
        expect(result.hasOwnProperty("other1")).toBeTruthy();
        expect(result.hasOwnProperty("other3")).toBeTruthy();
      });

      it("create() returns an object without the specified property path for a nested object", () => {
        interface IInstance {
          withme: string;
          with: {
            me: string;
            out?: string;
          };
        }

        const instance = {
          withme: "abc",
          with: {
            me: "me",
            out: "out"
          }
        };

        const result = fixture
          .build<IInstance>()
          .like(instance)
          .without("with.out")
          .create();

        expect(result.hasOwnProperty("withme")).toBeTruthy();
        expect(result.with.hasOwnProperty("me")).toBeTruthy();
        expect(result.with.hasOwnProperty("out")).toBeFalsy();
      });
    });

    describe("with()", () => {
      it("create() returns an object with the specified property set to the specified value", () => {
        interface IInstance {
          withme: string;
          withoutme: number;
        }

        const instance = {
          withme: "abc",
          withoutme: 123
        };

        const result = fixture
          .build<IInstance>()
          .like(instance)
          .with("withme", 42)
          .create();

        expect(result.hasOwnProperty("withme")).toBeTruthy();
        expect(result.withme).toEqual(42);
      });

      it("create() returns an object with the specified object path set to the specified value", () => {
        interface IInstance {
          with: {
            me: string;
          };
          withoutme: number;
        }

        const instance = {
          with: {
            me: 42
          },
          withoutme: 123
        };

        const result = fixture
          .build<IInstance>()
          .like(instance)
          .with("with.me", 42)
          .create();

        expect(result.hasOwnProperty("with")).toBeTruthy();
        expect(result.with.me).toEqual(42);
      });

      it("overrides any specified withouts that may be present", () => {
        interface IInstance {
          prop: string;
          another: number;
        }

        const instance = {
          prop: "abc",
          another: 123
        };

        const result = fixture
          .build<IInstance>()
          .like(instance)
          .with("prop", 42)
          .without("prop")
          .create();

        expect(result.hasOwnProperty("prop")).toBeTruthy();
        expect(result.prop).toEqual(42);
      });

      it("allows multiple properties to be set to specific values", () => {
        interface IInstance {
          key1: string;
          key2: string;
          key3: string;
          key4: string;
          key5: string;
          other1: number;
          other2: number;
          other3: boolean;
        }

        const instance = {
          key1: "value1",
          key2: "value2",
          key3: "value3",
          key4: "value4",
          key5: "value1",
          other1: 1,
          other2: 3,
          other3: false
        };

        const result = fixture
          .build<IInstance>()
          .like(instance)
          .with("key1", 1)
          .with("key2", 2)
          .with("key3", 3)
          .with("key4", 4)
          .with("other2", "three")
          .create();

        expect(result.key1).toBe(1);
        expect(result.key2).toBe(2);
        expect(result.key3).toBe(3);
        expect(result.key4).toBe(4);
        expect(result.other2).toBe("three");
        expect(result.key5).not.toEqual("value1");
        expect(result.other1).not.toEqual("value1");
      });
    });
  });
});
