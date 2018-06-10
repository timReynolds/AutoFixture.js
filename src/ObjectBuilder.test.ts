import AutoFixture from "./AutoFixture";

describe("ObjectBuilder", () => {
  let fixture;

  beforeEach(() => {
    fixture = new AutoFixture();
  });

  it("build().create() returns a new object", () => {
    const o = fixture.build().create();
    expect(typeof o).toEqual("object");
  });

  describe("like()", () => {
    it("create() returns an object with the same properties as instance", () => {
      const instance = {
        abc: "def",
        xyz: 123,
        lol: {}
      };
      const o = fixture
        .build()
        .like(instance)
        .create();
      expect(o.abc).toBeDefined();
      expect(o.xyz).toBeDefined();
      expect(o.lol).toBeDefined();
    });

    it("create() returns an object with property values as the same type as its likeness", () => {
      const instance = {
        str: "def",
        num: 123,
        bool: false,
        obj: {}
      };

      const result = fixture
        .build()
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
          .without("key1", 1)
          .without("key2", 2)
          .without("key3", 3)
          .without("key4", 4)
          .without("other2", "three")
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
          .without("key1", 1)
          .without("key2", 2)
          .without("key3", 3)
          .without("key4", 4)
          .without("other2", "three")
          .create();

        expect(result.hasOwnProperty("key5")).toBeTruthy();
        expect(result.hasOwnProperty("other1")).toBeTruthy();
        expect(result.hasOwnProperty("other3")).toBeTruthy();
      });

      it("create() returns an object without the specified property path for a nested object", () => {
        const instance = {
          withme: "abc",
          with: {
            me: "me",
            out: "out"
          }
        };

        const result = fixture
          .build()
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
        const instance = {
          withme: "abc",
          withoutme: 123
        };

        const result = fixture
          .build()
          .like(instance)
          .with("withme", 42)
          .create();

        expect(result.hasOwnProperty("withme")).toBeTruthy();
        expect(result.withme).toEqual(42);
      });

      it("create() returns an object with the specified object path set to the specified value", () => {
        const instance = {
          with: {
            me: 42
          },
          withoutme: 123
        };

        const result = fixture
          .build()
          .like(instance)
          .with("with.me", 42)
          .create();

        expect(result.hasOwnProperty("with")).toBeTruthy();
        expect(result.with.me).toEqual(42);
      });

      it("overrides any specified withouts that may be present", () => {
        const instance = {
          prop: "abc",
          another: 123
        };

        const result = fixture
          .build()
          .like(instance)
          .with("prop", 42)
          .without("prop")
          .create();

        expect(result.hasOwnProperty("prop")).toBeTruthy();
        expect(result.prop).toEqual(42);
      });

      it("allows multiple properties to be set to specific values", () => {
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
