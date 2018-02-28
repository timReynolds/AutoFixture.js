import IObjectBuilder from "./IObjectBuilder";

export default interface IAutoFixture {
  create<T>(typeInfo: any): T;
  createMany<T>(typeInfo: any): T[];
  build<T>(): IObjectBuilder<T>;
};
