import { TitheDiscountEntity } from '../../domain/tithe-discount.entity';

export const TITHE_DISCOUNT_REPOSITORY = 'TITHE_DISCOUNT_REPOSITORY';

export interface TitheDiscountRepositoryPort {
  create(payload: {
    effectiveFrom: Date;
    rules: Record<string, unknown>;
    createdBy: string;
  }): Promise<TitheDiscountEntity>;

  activate(id: string): Promise<TitheDiscountEntity>;

  findById(id: string): Promise<TitheDiscountEntity | null>;

  findActive(): Promise<TitheDiscountEntity | null>;

  findMany(): Promise<TitheDiscountEntity[]>;
}
