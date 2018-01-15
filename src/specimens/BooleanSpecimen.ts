import ISpecimen from "../ISpecimen";

export default class BooleanSpecimen implements ISpecimen<Boolean> {
  public handles(typeInfo: any) {
    return (
      (typeof typeInfo === "function" && typeInfo === Boolean) ||
      typeof typeInfo === "boolean"
    );
  }
  public create(typeInfo: any) {
    return Math.random() < 0.5;
  }
}
