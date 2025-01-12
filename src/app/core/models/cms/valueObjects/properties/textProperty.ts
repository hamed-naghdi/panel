import {BaseCmsProperty} from './baseCmsProperty';
import {PropertyType} from '../../enums/propertyType';

export class TextProperty extends BaseCmsProperty<string> {
  constructor(value?: string) {
    super(PropertyType.Text, value);
  }
}
