export interface ISpecimenConstructor<T> {
  new (builderFactory: any): ISpecimen<T>;
}

export default interface ISpecimen<T> {
  handles: (typeInfo: any) => boolean;
  create: (typeInfo: any, args: any[]) => T;
};
