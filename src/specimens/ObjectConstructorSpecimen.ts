import ISpecimen from "../ISpecimen";
import { ctorRegex, isConstructorFunctionRx } from "../regex";

const getName = (typeInfo: any) => {
  const name = typeInfo.name;
  if (typeof name === "undefined" && typeof typeInfo === "function") {
    const match = typeInfo.toString().match(ctorRegex);
    if (match !== null) {
      return match[0];
    }
  }
  return name;
};

export default class ObjectConstructorSpecimen<T> implements ISpecimen<T> {
  private _builderFactory: any;

  constructor(builderFactory: any) {
    this._builderFactory = builderFactory;
  }

  public handles(typeInfo: any) {
    return (
      typeof typeInfo === "function" &&
      isConstructorFunctionRx.test(typeInfo.name)
    );
  }

  public create(typeInfo: any, args: any) {
    try {
      return this._builderFactory()
        .like(typeInfo)
        .create();
    } catch (err) {
      throw new Error("Unable to create instance of " + getName(typeInfo));
    }
  }
}
