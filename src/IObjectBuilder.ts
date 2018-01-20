export type likenessCreator = Object | Function;

export default interface IObjectBuilder {
  create: () => { [index: string]: any; [index: number]: any };
  like: (creator: likenessCreator) => void;
  without: (propName: string) => void;
  with: (propName: string, value: any) => void;
};
