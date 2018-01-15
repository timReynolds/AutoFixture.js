import IAutoFixture from "./IAutoFixture";
import IObjectBuilder from "./IObjectBuilder";
import ISpecimen from "./ISpecimen";

import specimensFactory from "./specimens";
import ObjectBuilder from "./ObjectBuilder";

export default class AutoFixture<T> implements IAutoFixture<T> {
  private specimens: ISpecimen<any>[];

  constructor() {
    this.specimens = specimensFactory(this.builderFactory.bind(this));
  }

  private builderFactory(): IObjectBuilder<T> {
    return new ObjectBuilder(this);
  }

  private createInternal<T>(typeInfo: any, providedArgs: IArguments): T {
    var i;
    for (i = 0; i < this.specimens.length; ++i) {
      if (this.specimens[i].handles(typeInfo)) {
        // arguments isn't really an array, so get one
        var args = Array.prototype.slice.call(providedArgs);
        return this.specimens[i].create(typeInfo, args.slice(1));
      }
    }
    throw new Error("Unsupported Specimen: " + typeInfo);
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public create(typeInfo: any): T {
    return this.createInternal<T>(typeInfo, arguments);
  }

  public createMany(typeInfo: any): T[] {
    var count = this.getRandomInt(3, 10);
    var result = [];
    for (var i = 0; i < count; ++i) {
      result.push(this.createInternal(typeInfo, arguments));
    }
    return result;
  }

  public build() {
    return this.builderFactory();
  }
}
