import ISpecimen from "../ISpecimen";

export default class FactoryFunctionSpecimen<T> implements ISpecimen<T> {
  private _builderFactory: any;

  constructor(builderFactory: any) {
    this._builderFactory = builderFactory;
  }

  public handles(typeInfo: any) {
    return typeof typeInfo === "function";
  }

  public create(typeInfo: any) {
    try {
      return this._builderFactory()
        .like(typeInfo)
        .create();
    } catch (err) {
      throw new Error("Unable to create instance using factory function");
    }
  }
}
