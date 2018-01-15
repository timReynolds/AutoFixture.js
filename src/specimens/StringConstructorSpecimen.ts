import ISpecimen from "../ISpecimen";
import createGuid from "../createGuid";

export default class StringConstructorSpecimen implements ISpecimen<string> {
  public handles(typeInfo: any) {
    return typeof typeInfo === "function" && typeInfo === String;
  }
  public create(typeInfo: any) {
    return createGuid();
  }
}
