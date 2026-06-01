export class CreateParishionerCommand {
  constructor(
    public readonly payload: {
      name: string;
      baptized: boolean;
      email?: string | null;
      phone?: string | null;
      address?: string | null;
    },
  ) {}
}
