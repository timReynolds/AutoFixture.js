export type likenessCreator = {} | (() => void);

export default interface IObjectBuilder<
  T extends { [index: string]: any; [index: number]: any }
> {
  create: () => T;
  createMany: (manyCount?: number) => T[];
  like: (creator: likenessCreator) => IObjectBuilder<T>;
  without: (propName: string) => IObjectBuilder<T>;
  with: (propName: string, value: any) => IObjectBuilder<T>;
}
