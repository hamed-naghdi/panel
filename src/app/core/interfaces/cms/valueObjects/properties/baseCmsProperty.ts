import {PropertyType} from '../../enums/propertyType';

export abstract class BaseCmsProperty<T> {
  readonly value?: T;
  readonly propertyType?: PropertyType;

  protected constructor(propertyType: PropertyType, value?: T) {
    this.value = value;
    this.propertyType = propertyType;
  }
}
