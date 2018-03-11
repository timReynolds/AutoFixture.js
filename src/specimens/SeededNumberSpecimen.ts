import ISpecimen from "../ISpecimen";

export default class SeededNumberSpecimenFactory implements ISpecimen<number> {
  public handles(typeInfo: any) {
    return typeof typeInfo === "number";
  }
  public create(typeInfo: any) {
    let multiplier = 1;
    if (typeof typeInfo === "number" && typeInfo !== 0) {
      multiplier = typeInfo;
    }
    return Math.random() * multiplier;
  }
}
