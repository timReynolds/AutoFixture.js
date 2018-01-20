import ISpecimen, { ISpecimenConstructor } from "../ISpecimen";
import IObjectBuilder from "../IObjectBuilder";

import PrefixedStringSpecimen from "./PrefixedStringSpecimen";
import StringConstructorSpecimen from "./StringConstructorSpecimen";
import NumberConstructorSpecimen from "./NumberConstructorSpecimen";
import SeededNumberSpecimen from "./SeededNumberSpecimen";
import BooleanSpecimen from "./BooleanSpecimen";
import ObjectConstructorSpecimen from "./ObjectConstructorSpecimen";
import FactoryFunctionSpecimen from "./FactoryFunctionSpecimen";
import ObjectSpecimen from "./ObjectSpecimen";

function specimenFactory<T>(
  Specimen: ISpecimenConstructor<T>,
  objectBuilderFactory: () => any
): ISpecimen<T> {
  return new Specimen(objectBuilderFactory);
}

export default (objectBuilderFactory: () => IObjectBuilder) =>
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
