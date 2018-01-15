export default interface IAutoFixture<T> {
  create(typeInfo: any): T;
  createMany(typeInfo: any): T[];
  build(): void;
};
