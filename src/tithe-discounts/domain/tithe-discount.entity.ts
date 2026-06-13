export type DiscountStatusValue = 'DRAFT' | 'ACTIVE' | 'RETIRED';

export interface TitheDiscountEntity {
  id: string;
  version: number;
  status: DiscountStatusValue;
  effectiveFrom: Date;
  rules: Record<string, unknown>;
  createdBy: string;
  createdAt: Date;
  activatedAt: Date | null;
}
