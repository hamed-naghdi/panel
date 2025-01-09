import {BaseAuditableEntity} from '../../baseAuditableEntity';

export abstract class BaseCmsEntity extends BaseAuditableEntity<string> {
  order?: number;
  published!: Date;

  protected constructor() {
    super();
  }
}
