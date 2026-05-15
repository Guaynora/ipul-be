import { ParishionerEntity } from '../../domain/parishioner.entity';

export const PARISHIONER_REPOSITORY = 'PARISHIONER_REPOSITORY';

export interface ParishionerRepositoryPort {
  create(payload: {
    name: string;
    baptized: boolean;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
  }): Promise<ParishionerEntity>;
  update(
    id: string,
    payload: Partial<{
      name: string;
      baptized: boolean;
      email: string | null;
      phone: string | null;
      address: string | null;
    }>,
  ): Promise<ParishionerEntity>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<ParishionerEntity | null>;
  findAll(): Promise<ParishionerEntity[]>;
}
