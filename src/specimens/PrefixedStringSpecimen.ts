import createGuid from "../createGuid";
import ISpecimen from "../ISpecimen";

export default class PrefixedStringSpecimen implements ISpecimen<string> {
  public handles(typeInfo: any) {
    return typeof typeInfo === "string";
  }
  public create(typeInfo: any) {
    return typeInfo + createGuid();
  }
}
