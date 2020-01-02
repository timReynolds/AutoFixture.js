import IObjectBuilder from './IObjectBuilder';

export default interface IAutoFixture {
  create<T>(typeInfo: any, multiplier?: number): T;
  createMany<T>(typeInfo: any, manyCount?: number): T[];
  build<T>(): IObjectBuilder<T>;
}
