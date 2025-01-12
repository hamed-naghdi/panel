import { Enumeration } from "../../enumeration";

export class PageStatus extends Enumeration {
  static readonly Draft = new PageStatus(1, "Draft");
  static readonly Published = new PageStatus(2, "Published");

  private constructor(id: number, name: string) {
    super(id, name);
  }
}
