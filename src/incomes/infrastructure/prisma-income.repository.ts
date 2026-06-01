import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { IncomeRepositoryPort } from '../application/ports/income.repository.port';

@Injectable()
export class PrismaIncomeRepository implements IncomeRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: {
    type: 'OFFERING' | 'TITHE' | 'SALE_OTHER';
    amount: string;
    date: Date;
    description?: string | null;
    parishionerId?: string | null;
    createdBy: string;
  }) {
    const created = await this.prisma.income.create({
      data: {
        type: payload.type,
        amount: new Prisma.Decimal(payload.amount),
        date: payload.date,
        description: payload.description ?? null,
        parishionerId: payload.parishionerId ?? null,
        createdBy: payload.createdBy,
      },
    });

    return {
      ...created,
      amount: created.amount.toString(),
    };
  }

  async findMany() {
    const incomes = await this.prisma.income.findMany({
      orderBy: { date: 'desc' },
    });
    return incomes.map((income) => ({
      ...income,
      amount: income.amount.toString(),
    }));
  }
}
