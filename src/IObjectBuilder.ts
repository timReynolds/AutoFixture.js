export type likenessCreator = {} | (() => void);

export type IPath = Array<number | string> | number | string;
export type IMultiArray = IPath[];

export default interface IObjectBuilder<
  T extends { [index: string]: any; [index: number]: any }
> {
  create: () => T;
  createMany: (manyCount?: number) => T[];
  like: (creator: likenessCreator) => this;
  without: (path: IPath) => this;
  with: (path: IPath, value: any) => this;
}
