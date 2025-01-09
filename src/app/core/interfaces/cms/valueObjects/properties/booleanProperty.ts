import {BaseCmsProperty} from './baseCmsProperty';
import {PropertyType} from '../../enums/propertyType';

export class BooleanProperty extends BaseCmsProperty<boolean> {
  constructor(value?: boolean) {
    super(PropertyType.Boolean, value);
  }
}
