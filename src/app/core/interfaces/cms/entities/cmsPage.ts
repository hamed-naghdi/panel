import {BaseCmsEntity} from './baseCmsEntity';
import {PageStatus} from '../enums/pageStatusEnum';
import {BooleanProperty} from '../valueObjects/properties/booleanProperty';
import {TextProperty} from '../valueObjects/properties/textProperty';
import {TemplateEnum} from '../enums/templateEnum';

export class CmsPage extends BaseCmsEntity {
  readonly status: PageStatus;
  readonly isHomePage: BooleanProperty;
  readonly name: TextProperty;
  readonly slug: TextProperty;
  readonly template: TemplateEnum;

  constructor(
    status: PageStatus,
    isHomePage: BooleanProperty,
    name: TextProperty,
    slug: TextProperty,
    template: TemplateEnum
  ) {
    super();
    this.status = status;
    this.isHomePage = isHomePage;
    this.name = name;
    this.slug = slug;
    this.template = template;
  }
}
