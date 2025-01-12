import {BaseEntity} from './baseEntity';

export abstract class BaseAuditableEntity<T> extends BaseEntity<T> {
  created!: Date; // Date in TypeScript
  createdBy?: string; // Use `string` to represent GUID

  modified?: Date;
  modifiedBy?: string;
}
