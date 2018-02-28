import IAutoFixture from "./IAutoFixture";
import IObjectBuilder from "./IObjectBuilder";
import ISpecimen from "./ISpecimen";

import ObjectBuilder from "./ObjectBuilder";
import specimensFactory from "./specimens";

export { default as IAutoFixture } from "./IAutoFixture";
export { default as IObjectBuilder } from "./IObjectBuilder";
export { default as ISpecimen } from "./ISpecimen";

export default class AutoFixture implements IAutoFixture {
  private specimens: Array<ISpecimen<any>>;

  constructor() {
    this.specimens = specimensFactory(this.builderFactory.bind(this));
  }

  public create<T>(typeInfo: any): T {
    return this.createInternal<T>(typeInfo, arguments);
  }

  public createMany<T>(typeInfo: any): T[] {
    const count = this.getRandomInt(3, 10);
    const accum = Array(Math.max(0, count));
    for (let i = 0; i < count; i++) {
      accum[i] = this.createInternal(typeInfo, arguments);
    }
    return accum;
  }

  public build<T>() {
    return this.builderFactory<T>();
  }

  private builderFactory<T>(): IObjectBuilder<T> {
    return new ObjectBuilder(this);
  }

  private createInternal<T>(typeInfo: any, providedArgs: IArguments): T {
    const validSpeciments = this.specimens.filter(specimen =>
      specimen.handles(typeInfo)
    );

    if (validSpeciments.length === 0) {
      throw new Error("Unsupported Specimen: " + typeInfo);
    }

    const [, ...tailArgs] = providedArgs;
    return validSpeciments[0].create(typeInfo, tailArgs);
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
