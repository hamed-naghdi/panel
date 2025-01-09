import { Enumeration } from "../../enumeration";

export class TemplateEnum extends Enumeration {
  static readonly Default = new TemplateEnum(1, "Default");
  static readonly Home = new TemplateEnum(2, "Home");

  private constructor(id: number, name: string) {
    super(id, name);
  }
}
