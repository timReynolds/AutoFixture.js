import IObjectBuilder from "./IObjectBuilder";

export default interface IAutoFixture {
  create<T>(typeInfo: any): T;
  createMany<T>(typeInfo: any, manyCount?: number): T[];
  build<T>(): IObjectBuilder<T>;
};
