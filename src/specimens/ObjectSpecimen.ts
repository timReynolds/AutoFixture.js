import ISpecimen from "../ISpecimen";

export default class ObjectSpecimen<T> implements ISpecimen<T> {
  private _builderFactory: any;
  constructor(builderFactory: any) {
    this._builderFactory = builderFactory;
  }
  public handles(typeInfo: any) {
    return typeof typeInfo === "object";
  }
  public create(typeInfo: any) {
    return this._builderFactory()
      .like(typeInfo)
      .create();
  }
}
