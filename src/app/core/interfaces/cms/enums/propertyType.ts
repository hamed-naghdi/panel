import { Enumeration } from "../../enumeration";

export class PropertyType extends Enumeration {
  static readonly Text = new PropertyType(1, 'Text');
  static readonly RichText = new PropertyType(2, 'RichText');
  static readonly Email = new PropertyType(3, 'Email');
  static readonly Uri = new PropertyType(4, 'Uri');
  static readonly Password = new PropertyType(5, 'Password');

  static readonly Boolean = new PropertyType(10, 'Boolean');

  static readonly NumberInt = new PropertyType(20, 'NumberInt');
  static readonly NumberLong = new PropertyType(21, 'NumberLong');
  static readonly NumberFloat = new PropertyType(22, 'NumberFloat');
  static readonly NumberDouble = new PropertyType(23, 'NumberDouble');
  static readonly NumberDecimal = new PropertyType(24, 'NumberDecimal');

  static readonly Enumeration = new PropertyType(70, "Enumeration");

  private constructor(id: number, name: string) {
    super(id, name);
  }
}
