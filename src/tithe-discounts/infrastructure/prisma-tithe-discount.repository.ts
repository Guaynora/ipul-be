import { Injectable } from '@nestjs/common';
import { Prisma, DiscountVersion } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { TitheDiscountEntity } from '../domain/tithe-discount.entity';
import { TitheDiscountRepositoryPort } from '../application/ports/tithe-discount.repository.port';

function toEntity(record: DiscountVersion): TitheDiscountEntity {
  return {
    id: record.id,
    version: record.version,
    status: record.status as TitheDiscountEntity['status'],
    effectiveFrom: record.effectiveFrom,
    rules: record.rules as Record<string, unknown>,
    createdBy: record.createdBy,
    createdAt: record.createdAt,
    activatedAt: record.activatedAt,
  };
}

@Injectable()
export class PrismaTitheDiscountRepository implements TitheDiscountRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: {
    effectiveFrom: Date;
    rules: Record<string, unknown>;
    createdBy: string;
  }): Promise<TitheDiscountEntity> {
    const aggregate = await this.prisma.discountVersion.aggregate({
      _max: { version: true },
    });
    const nextVersion = (aggregate._max.version ?? 0) + 1;

    const created = await this.prisma.discountVersion.create({
      data: {
        version: nextVersion,
        effectiveFrom: payload.effectiveFrom,
        rules: payload.rules as Prisma.InputJsonValue,
        createdBy: payload.createdBy,
      },
    });

    return toEntity(created);
  }

  async activate(id: string): Promise<TitheDiscountEntity> {
    const currentActive = await this.prisma.discountVersion.findFirst({
      where: { status: 'ACTIVE' },
    });

    const activated = await this.prisma.$transaction(async (tx) => {
      if (currentActive) {
        await tx.discountVersion.update({
          where: { id: currentActive.id },
          data: { status: 'RETIRED' },
        });
      }

      return tx.discountVersion.update({
        where: { id },
        data: { status: 'ACTIVE', activatedAt: new Date() },
      });
    });

    return toEntity(activated);
  }

  async findById(id: string): Promise<TitheDiscountEntity | null> {
    const record = await this.prisma.discountVersion.findUnique({
      where: { id },
    });
    return record ? toEntity(record) : null;
  }

  async findActive(): Promise<TitheDiscountEntity | null> {
    const record = await this.prisma.discountVersion.findFirst({
      where: { status: 'ACTIVE' },
    });
    return record ? toEntity(record) : null;
  }

  async findMany(): Promise<TitheDiscountEntity[]> {
    const records = await this.prisma.discountVersion.findMany({
      orderBy: { version: 'desc' },
    });
    return records.map(toEntity);
  }
}
