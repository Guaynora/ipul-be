export class Money {
  private constructor(private readonly value: string) {}

  static from(input: string | number): Money {
    const value = Number(input);
    if (Number.isNaN(value)) {
      throw new Error('Invalid money value');
    }

    return new Money(value.toFixed(2));
  }

  toString(): string {
    return this.value;
  }
}
