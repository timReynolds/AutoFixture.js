import { ctorRegex } from "./regex";
import IAutoFixture from "./IAutoFixture";
import IObjectBuilder, { likenessCreator } from "./IObjectBuilder";

//TODO: Remove any
function isFunction(sample: likenessCreator) {
  return sample !== null && typeof sample === "function";
}

function isConstructorFunction(sample: likenessCreator): boolean {
  return sample.toString().match(ctorRegex) !== null;
}

function createInstanceOf<T>(sample: any): { [index: string]: any } {
  //TODO: this should be type likenessCreator, return is BS also
  let instance = {};
  if (isConstructorFunction(sample)) {
    try {
      return new sample();
    } catch (ex) {
      throw new Error("Unable to create new instance: " + ex.message);
    }
  } else if (isFunction(sample)) {
    try {
      instance = sample();
    } catch (ex) {
      throw new Error("Factory function failed: " + ex.message);
    }
    if (instance === null || typeof instance === "undefined") {
      throw new Error("Factory function returned null or undefined");
    }
  }
  return instance;
}

function getLikenessInstance(
  sample: likenessCreator
): { [index: string]: any } {
  // TODO: Fix this index def
  if (isFunction(sample)) {
    return createInstanceOf(sample);
  }
  return sample;
}

export default class ObjectBuilder<T> implements IObjectBuilder<T> {
  private fixture: IAutoFixture<T>;
  private withouts: { [index: string]: any };
  private withs: { [index: string]: any };
  private likeness: likenessCreator;

  constructor(fixture: IAutoFixture<T>) {
    this.fixture = fixture;
    this.withouts = {};
    this.withs = {};
    this.likeness = {};
  }

  public create() {
    const likenessInstance = getLikenessInstance(this.likeness);
    const result = createInstanceOf<T>(this.likeness); // TODO: Don't see how this isn't just an object

    let i: number;
    let keys: string[];

    if (typeof likenessInstance !== "undefined" && likenessInstance !== null) {
      keys = Object.keys(likenessInstance);
      for (i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (!this.withouts.hasOwnProperty(key)) {
          if (typeof likenessInstance[key] === "string") {
            result[key] = this.fixture.create(key);
          } else {
            result[key] = this.fixture.create(likenessInstance[key]);
          }
        }
      }

      keys = Object.keys(this.withs);
      for (i = 0; i < keys.length; ++i) {
        const key = keys[i];
        result[key] = this.withs[key];
      }
    }
    return result;
  }

  public like(instance: likenessCreator) {
    this.likeness = instance || {};
    return this;
  }

  public without(propName: string) {
    this.withouts[propName] = true;
    return this;
  }

  public with(propName: string, propValue: any) {
    this.withs[propName] = propValue;
    return this;
  }
}
