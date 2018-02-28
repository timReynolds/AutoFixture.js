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
      const o = fixture
        .build()
        .like(instance)
        .create();
      expect(typeof o.str).toEqual("string");
      expect(typeof o.num).toEqual("number");
      expect(typeof o.bool).toEqual("boolean");
      expect(typeof o.obj).toEqual("object");
    });

    describe("without()", () => {
      it("create() returns an object without the specified property set", () => {
        const instance = {
          withme: "abc",
          withoutme: 123
        };
        const obj = fixture
          .build()
          .like(instance)
          .without("withoutme")
          .create();
        expect(obj.hasOwnProperty("withme")).toBeTruthy();
        expect(obj.hasOwnProperty("withoutme")).toBeFalsy();
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
        const obj = fixture
          .build()
          .like(instance)
          .without("key1", 1)
          .without("key2", 2)
          .without("key3", 3)
          .without("key4", 4)
          .without("other2", "three")
          .create();
        expect(obj.hasOwnProperty("key1")).toBeFalsy();
        expect(obj.hasOwnProperty("key2")).toBeFalsy();
        expect(obj.hasOwnProperty("key3")).toBeFalsy();
        expect(obj.hasOwnProperty("key4")).toBeFalsy();
        expect(obj.hasOwnProperty("other2")).toBeFalsy();
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
        const obj = fixture
          .build()
          .like(instance)
          .without("key1", 1)
          .without("key2", 2)
          .without("key3", 3)
          .without("key4", 4)
          .without("other2", "three")
          .create();

        expect(obj.hasOwnProperty("key5")).toBeTruthy();
        expect(obj.hasOwnProperty("other1")).toBeTruthy();
        expect(obj.hasOwnProperty("other3")).toBeTruthy();
      });
    });

    describe("with()", () => {
      it("create() returns an object with the specified property set to the specified value", () => {
        const instance = {
          withme: "abc",
          withoutme: 123
        };
        const obj = fixture
          .build()
          .like(instance)
          .with("withme", 42)
          .create();
        expect(obj.hasOwnProperty("withme")).toBeTruthy();
        expect(obj.withme).toEqual(42);
      });

      it("overrides any specified withouts that may be present", () => {
        const instance = {
          prop: "abc",
          another: 123
        };
        const obj = fixture
          .build()
          .like(instance)
          .with("prop", 42)
          .without("prop")
          .create();
        expect(obj.hasOwnProperty("prop")).toBeTruthy();
        expect(obj.prop).toEqual(42);
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
        const obj = fixture
          .build()
          .like(instance)
          .with("key1", 1)
          .with("key2", 2)
          .with("key3", 3)
          .with("key4", 4)
          .with("other2", "three")
          .create();
        expect(obj.key1).toBe(1);
        expect(obj.key2).toBe(2);
        expect(obj.key3).toBe(3);
        expect(obj.key4).toBe(4);
        expect(obj.other2).toBe("three");
        expect(obj.key5).not.toEqual("value1");
        expect(obj.other1).not.toEqual("value1");
      });
    });
  });
});
