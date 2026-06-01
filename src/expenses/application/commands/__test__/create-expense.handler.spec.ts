import { UnprocessableEntityException } from '@nestjs/common';
import { FundSource } from '../../../../shared/presentation/graphql.types';
import { CreateExpenseCommand } from '../create-expense.command';
import { CreateExpenseHandler } from '../create-expense.handler';

describe('CreateExpenseHandler', () => {
  it('creates an expense successfully', async () => {
    const created = {
      id: 'e-1',
      description: 'Pago de electricidad',
      amount: '120.50',
      date: new Date('2026-01-01'),
      category: 'Servicios',
      fundSource: FundSource.NON_TITHE,
      createdBy: 'admin@ipul.local',
    };
    const expenseRepository = {
      create: jest.fn().mockResolvedValue(created),
      findMany: jest.fn(),
    };
    const handler = new CreateExpenseHandler(expenseRepository);

    const result = await handler.execute(
      new CreateExpenseCommand({
        description: '  Pago de electricidad  ',
        amount: '120.50',
        date: new Date('2026-01-01'),
        category: '  Servicios ',
        fundSource: FundSource.NON_TITHE,
        createdBy: 'admin@ipul.local',
      }),
    );

    expect(result).toEqual(created);
    expect(expenseRepository.create).toHaveBeenCalledWith({
      description: 'Pago de electricidad',
      amount: '120.50',
      date: new Date('2026-01-01'),
      category: 'Servicios',
      fundSource: FundSource.NON_TITHE,
      createdBy: 'admin@ipul.local',
    });
  });

  it('rejects invalid amount', async () => {
    const expenseRepository = {
      create: jest.fn(),
      findMany: jest.fn(),
    };
    const handler = new CreateExpenseHandler(expenseRepository);

    await expect(
      handler.execute(
        new CreateExpenseCommand({
          description: 'Papeleria',
          amount: '0',
          date: new Date('2026-01-01'),
          category: 'Oficina',
          fundSource: FundSource.TITHE,
          createdBy: 'admin@ipul.local',
        }),
      ),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
  });

  it('rejects empty description and category', async () => {
    const expenseRepository = {
      create: jest.fn(),
      findMany: jest.fn(),
    };
    const handler = new CreateExpenseHandler(expenseRepository);

    await expect(
      handler.execute(
        new CreateExpenseCommand({
          description: '   ',
          amount: '10.00',
          date: new Date('2026-01-01'),
          category: 'Oficina',
          fundSource: FundSource.NON_TITHE,
          createdBy: 'admin@ipul.local',
        }),
      ),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);

    await expect(
      handler.execute(
        new CreateExpenseCommand({
          description: 'Compra',
          amount: '10.00',
          date: new Date('2026-01-01'),
          category: '   ',
          fundSource: FundSource.NON_TITHE,
          createdBy: 'admin@ipul.local',
        }),
      ),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
  });
});
