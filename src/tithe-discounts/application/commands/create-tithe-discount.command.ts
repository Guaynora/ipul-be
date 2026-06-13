export class CreateTitheDiscountCommand {
  constructor(
    public readonly payload: {
      effectiveFrom: Date;
      rules: string;
      createdBy: string;
    },
  ) {}
}
