import IAutoFixture from "./IAutoFixture";
import IObjectBuilder, { likenessCreator } from "./IObjectBuilder";

import { ctorRegex } from "./regex";

function isFunction(sample: likenessCreator) {
  return sample !== null && typeof sample === "function";
}

function isConstructorFunction(sample: likenessCreator): boolean {
  return sample.toString().match(ctorRegex) !== null;
}

function createInstanceOf(sample: any): { [index: string]: any } {
  let instance = {};

  if (isConstructorFunction(sample)) {
    try {
      return new sample();
    } catch (ex) {
      throw new Error("Unable to create new instance: " + ex.message);
    }
  }

  if (isFunction(sample)) {
    try {
      instance = sample();
    } catch (ex) {
      throw new Error("Factory function failed: " + ex.message);
    }

    if (instance === null || typeof instance === "undefined") {
      throw new Error("Factory function returned null or undefined");
    }

    return instance;
  }

  return instance;
}

function getLikenessInstance(
  sample: likenessCreator
): { [index: string]: any; [index: number]: any } {
  if (isFunction(sample)) {
    return createInstanceOf(sample);
  }
  return sample;
}

export default class ObjectBuilder<T> implements IObjectBuilder {
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
    const result = createInstanceOf(this.likeness);

    if (typeof likenessInstance === "undefined" && likenessInstance === null) {
      return result;
    }

    Object.keys(likenessInstance).forEach(key => {
      // Exclude without properties
      if (this.withouts.hasOwnProperty(key)) {
        return;
      }

      // Prefix string values
      if (typeof likenessInstance[key] === "string") {
        result[key] = this.fixture.create(key);
      } else {
        result[key] = this.fixture.create(likenessInstance[key]);
      }
    });

    // Override the result from withs
    Object.keys(this.withs).forEach(key => {
      result[key] = this.withs[key];
    });

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
