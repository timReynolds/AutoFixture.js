import ISpecimen, { ISpecimenConstructor } from "./ISpecimen";
import PrefixedStringSpecimen from "./PrefixedStringSpecimen";
import StringConstructorSpecimen from "./StringConstructorSpecimen";
import NumberConstructorSpecimen from "./NumberConstructorSpecimen";
import SeededNumberSpecimen from "./SeededNumberSpecimen";
import BooleanSpecimen from "./BooleanSpecimen";
import ObjectConstructorSpecimen from "./ObjectConstructorSpecimen";
import FactoryFunctionSpecimen from "./FactoryFunctionSpecimen";
import ObjectSpecimen from "./ObjectSpecimen";

//TODO: Work out how this would work
function specimenFactory<T>(
  specimen: ISpecimenConstructor<T>,
  objectBuilderFactory: () => any
): ISpecimen<T> {
  return new specimen(objectBuilderFactory);
}

export default (objectBuilderFactory: () => any) =>
  [
    //TODO: Move this function
    PrefixedStringSpecimen,
    StringConstructorSpecimen,
    NumberConstructorSpecimen,
    SeededNumberSpecimen,
    BooleanSpecimen,
    ObjectConstructorSpecimen,
    FactoryFunctionSpecimen,
    ObjectSpecimen
  ].map(specimen => specimenFactory(specimen, objectBuilderFactory));
