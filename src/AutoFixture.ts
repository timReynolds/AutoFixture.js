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

  private builderFactory(): IObjectBuilder {
    return new ObjectBuilder(this);
  }

  private createInternal<T>(typeInfo: any, providedArgs: IArguments): T {
    const validSpeciments = this.specimens.filter(specimen =>
      specimen.handles(typeInfo)
    );

    if (validSpeciments.length === 0) {
      throw new Error("Unsupported Specimen: " + typeInfo);
    }

    const [_headArg, ...tailArgs] = providedArgs;
    return validSpeciments[0].create(typeInfo, tailArgs);
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public create(typeInfo: any): T {
    return this.createInternal<T>(typeInfo, arguments);
  }

  public createMany(typeInfo: any): T[] {
    const count = this.getRandomInt(3, 10);
    const accum = Array(Math.max(0, count));
    for (let i = 0; i < count; i++)
      accum[i] = this.createInternal(typeInfo, arguments);
    return accum;
  }

  public build() {
    return this.builderFactory();
  }
}
