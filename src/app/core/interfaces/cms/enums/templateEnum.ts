import { Enumeration } from "../../enumeration";

export class Template extends Enumeration {
  static readonly Default = new Template(1, "Default");
  static readonly Home = new Template(2, "Home");

  private constructor(id: number, name: string) {
    super(id, name);
  }
}
