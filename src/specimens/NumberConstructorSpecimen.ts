import ISpecimen from "../ISpecimen";

export default class NumberConstructorSpecimen implements ISpecimen<number> {
  public handles(typeInfo: any) {
    return typeof typeInfo === "function" && typeInfo === Number;
  }
  public create(typeInfo: any, args: any) {
    let multiplier = 1;
    if (args.length > 0 && typeof args[0] === "number") {
      multiplier = args[0];
    }
    return Math.random() * multiplier;
  }
}
