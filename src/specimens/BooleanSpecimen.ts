import ISpecimen from '../ISpecimen';

export default class BooleanSpecimen implements ISpecimen<boolean> {
  public handles(typeInfo: any) {
    return (
      (typeof typeInfo === 'function' && typeInfo === Boolean) ||
      typeof typeInfo === 'boolean'
    );
  }
  public create(_typeInfo: any) {
    return Math.random() < 0.5;
  }
}
