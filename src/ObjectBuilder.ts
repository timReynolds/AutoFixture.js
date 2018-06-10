import * as op from "object-path";
import IAutoFixture from "./IAutoFixture";
import IObjectBuilder, { likenessCreator } from "./IObjectBuilder";

import getRandomInt from "./getRandomInt";
import { ctorRegex } from "./regex";

type IPath = Array<number | string> | number | string;
type IMultiArray = IPath[];

function isFunction(sample: likenessCreator) {
  return sample !== null && typeof sample === "function";
}

function isConstructorFunction(sample: likenessCreator): boolean {
  return sample.toString().match(ctorRegex) !== null;
}

function createInstanceOf<T>(sample: any): T {
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

    return instance as T;
  }

  return instance as T;
}

function getLikenessInstance(
  sample: likenessCreator
): { [index: string]: any; [index: number]: any } {
  if (isFunction(sample)) {
    return createInstanceOf(sample);
  }
  return sample;
}

export default class ObjectBuilder<
  T extends { [index: string]: any; [index: number]: any }
> implements IObjectBuilder<T> {
  private fixture: IAutoFixture;
  private withouts: IMultiArray;
  private withs: Map<IPath, any>;
  private likeness: likenessCreator;

  constructor(fixture: IAutoFixture) {
    this.fixture = fixture;
    this.withouts = [];
    this.withs = new Map();
    this.likeness = {};
  }

  public create(): T {
    const likenessInstance = getLikenessInstance(this.likeness);
    const result = createInstanceOf<T>(this.likeness);

    if (typeof likenessInstance === "undefined" && likenessInstance === null) {
      return result;
    }

    Object.keys(likenessInstance).forEach(key => {
      // Prefix string values
      // tslint:disable-next-line:prefer-conditional-expression
      if (typeof likenessInstance[key] === "string") {
        result[key] = this.fixture.create(key);
      } else {
        result[key] = this.fixture.create(likenessInstance[key]);
      }
    });

    // Without overides
    this.withouts.forEach(objPath => {
      op.del(result, objPath);
    });

    this.withs.forEach((value, objPath) => {
      op.set(result, objPath, value);
    });

    return result;
  }

  public createMany(manyCount?: number) {
    const count = manyCount ? manyCount : getRandomInt(3, 10);
    const accum = Array(Math.max(0, count));
    for (let i = 0; i < count; i++) {
      accum[i] = this.create();
    }
    return accum;
  }

  public like(instance: likenessCreator) {
    this.likeness = instance || {};
    return this;
  }

  public without(objPath: IPath) {
    this.withouts.push(objPath);
    return this;
  }

  public with(objPath: IPath, value: any) {
    this.withs.set(objPath, value);
    return this;
  }
}
