import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ExpenseRepositoryPort } from '../application/ports/expense.repository.port';

@Injectable()
export class PrismaExpenseRepository implements ExpenseRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: {
    description: string;
    amount: string;
    date: Date;
    category: string;
    fundSource: 'TITHE' | 'NON_TITHE';
    createdBy: string;
  }) {
    const created = await this.prisma.expense.create({
      data: {
        description: payload.description,
        amount: new Prisma.Decimal(payload.amount),
        date: payload.date,
        category: payload.category,
        fundSource: payload.fundSource,
        createdBy: payload.createdBy,
      },
    });

    return {
      ...created,
      amount: created.amount.toString(),
    };
  }

  async findMany() {
    const expenses = await this.prisma.expense.findMany({
      orderBy: { date: 'desc' },
    });
    return expenses.map((expense) => ({
      ...expense,
      amount: expense.amount.toString(),
    }));
  }
}
