export abstract class Enumeration {
  readonly id: number;
  readonly name: string;

  protected constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  toString(): string {
    return this.name;
  }

  static getAll<T extends Enumeration>(): T[] {
    // Reflect over static properties of the derived class
    return Object.values(this)
      .filter(value => value instanceof this) as T[];
  }

  equals(other: unknown): boolean {
    if (!(other instanceof Enumeration)) {
      return false;
    }

    const typeMatches = this.constructor === other.constructor;
    const valueMatches = this.id === other.id;

    return typeMatches && valueMatches;
  }

  getHashCode(): number {
    return this.id; // JavaScript numbers can act as hashes for simplicity
  }

  static absoluteDifference(firstValue: Enumeration, secondValue: Enumeration): number {
    return Math.abs(firstValue.id - secondValue.id);
  }

  static fromValue<T extends Enumeration>(value: number): T | undefined {
    return this.getAll<T>().find(item => item.id === value);
  }

  static fromDisplayName<T extends Enumeration>(displayName: string): T | undefined {
    return this.getAll<T>().find(item => item.name === displayName);
  }
}
