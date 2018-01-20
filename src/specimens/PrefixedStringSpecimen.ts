import ISpecimen from "../ISpecimen";
import createGuid from "../createGuid";

export default class PrefixedStringSpecimen implements ISpecimen<string> {
  public handles(typeInfo: any) {
    return typeof typeInfo === "string";
  }
  public create(typeInfo: any) {
    return typeInfo + createGuid();
  }
}
