import IObjectBuilder from "../IObjectBuilder";
import ISpecimen, { ISpecimenConstructor } from "../ISpecimen";

import BooleanSpecimen from "./BooleanSpecimen";
import FactoryFunctionSpecimen from "./FactoryFunctionSpecimen";
import NumberConstructorSpecimen from "./NumberConstructorSpecimen";
import ObjectConstructorSpecimen from "./ObjectConstructorSpecimen";
import ObjectSpecimen from "./ObjectSpecimen";
import PrefixedStringSpecimen from "./PrefixedStringSpecimen";
import SeededNumberSpecimen from "./SeededNumberSpecimen";
import StringConstructorSpecimen from "./StringConstructorSpecimen";

function specimenFactory<T>(
  Specimen: ISpecimenConstructor<T>,
  objectBuilderFactory: () => any
): ISpecimen<T> {
  return new Specimen(objectBuilderFactory);
}

// IObjectBuilder<{}> isn't ideal.
// We know T is going to be an object but not what T is yet
export default (objectBuilderFactory: () => IObjectBuilder<{}>) =>
  [
    PrefixedStringSpecimen,
    StringConstructorSpecimen,
    NumberConstructorSpecimen,
    SeededNumberSpecimen,
    BooleanSpecimen,
    ObjectConstructorSpecimen,
    FactoryFunctionSpecimen,
    ObjectSpecimen
  ].map(specimen => specimenFactory(specimen, objectBuilderFactory));
