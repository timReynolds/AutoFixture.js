export type likenessCreator = Object | Function;

export default interface IObjectBuilder<T> {
  create: () => { [index: string]: any }; //TODO: this should be T
  like: (creator: likenessCreator) => void;
  without: (propName: string) => void;
  with: (propName: string, value: any) => void;
};
