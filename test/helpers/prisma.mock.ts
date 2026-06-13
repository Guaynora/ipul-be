import { Prisma } from '@prisma/client';

export function buildPrismaMock() {
  return {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn(),
    adminUser: { findUnique: jest.fn() },
    parishioner: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    income: {
      create: jest.fn(),
      findMany: jest.fn(),
      aggregate: jest.fn().mockResolvedValue({ _sum: { amount: new Prisma.Decimal(0) } }),
      groupBy: jest.fn().mockResolvedValue([]),
    },
    expense: {
      create: jest.fn(),
      findMany: jest.fn(),
      aggregate: jest.fn().mockResolvedValue({ _sum: { amount: new Prisma.Decimal(0) } }),
      groupBy: jest.fn().mockResolvedValue([]),
    },
    discountVersion: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      aggregate: jest.fn().mockResolvedValue({ _max: { version: null } }),
    },
  };
}

export type PrismaMock = ReturnType<typeof buildPrismaMock>;
