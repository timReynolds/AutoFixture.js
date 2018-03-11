import createGuid from "../createGuid";
import ISpecimen from "../ISpecimen";

export default class StringConstructorSpecimen implements ISpecimen<string> {
  public handles(typeInfo: any) {
    return typeof typeInfo === "function" && typeInfo === String;
  }
  public create(typeInfo: any) {
    return createGuid();
  }
}
