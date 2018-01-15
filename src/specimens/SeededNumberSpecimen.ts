import ISpecimen from "../ISpecimen";

export default class SeededNumberSpecimenFactory implements ISpecimen<Number> {
  public handles(typeInfo: any) {
    return typeof typeInfo === "number";
  }
  public create(typeInfo: any) {
    var multiplier = 1;
    if (typeof typeInfo === "number" && typeInfo !== 0) {
      multiplier = typeInfo;
    }
    return Math.random() * multiplier;
  }
}
