export type likenessCreator = Object | Function;

export default interface IObjectBuilder {
  create: () => { [index: string]: any; [index: number]: any };
  like: (creator: likenessCreator) => IObjectBuilder;
  without: (propName: string) => IObjectBuilder;
  with: (propName: string, value: any) => IObjectBuilder;
};
