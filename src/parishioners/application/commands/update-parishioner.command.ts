export class UpdateParishionerCommand {
  constructor(
    public readonly id: string,
    public readonly payload: {
      name?: string;
      baptized?: boolean;
      email?: string | null;
      phone?: string | null;
      address?: string | null;
    },
  ) {}
}
