import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IncomeType } from '../../../../shared/presentation/graphql.types';
import { CreateIncomeCommand } from '../create-income.command';
import { CreateIncomeHandler } from '../create-income.handler';

describe('CreateIncomeHandler', () => {
  it('accepts anonymous tithe when parishionerId is null', async () => {
    const created = {
      id: 'i-1',
      type: IncomeType.TITHE,
      amount: '50.00',
      date: new Date('2026-01-01'),
      description: null,
      parishionerId: null,
      createdBy: 'admin@ipul.local',
    };
    const incomeRepository = {
      create: jest.fn().mockResolvedValue(created),
      findMany: jest.fn(),
    };
    const parishionerReader = {
      existsById: jest.fn(),
    };
    const handler = new CreateIncomeHandler(
      incomeRepository,
      parishionerReader,
    );

    const result = await handler.execute(
      new CreateIncomeCommand({
        type: IncomeType.TITHE,
        amount: '50.00',
        date: new Date('2026-01-01'),
        parishionerId: null,
        description: null,
        createdBy: 'admin@ipul.local',
      }),
    );

    expect(result).toEqual(created);
    expect(parishionerReader.existsById).not.toHaveBeenCalled();
  });

  it('rejects parishionerId for OFFERING and SALE_OTHER', async () => {
    const incomeRepository = {
      create: jest.fn(),
      findMany: jest.fn(),
    };
    const parishionerReader = {
      existsById: jest.fn(),
    };
    const handler = new CreateIncomeHandler(
      incomeRepository,
      parishionerReader,
    );

    await expect(
      handler.execute(
        new CreateIncomeCommand({
          type: IncomeType.OFFERING,
          amount: '10.00',
          date: new Date(),
          parishionerId: 'p-1',
          createdBy: 'admin@ipul.local',
        }),
      ),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);

    await expect(
      handler.execute(
        new CreateIncomeCommand({
          type: IncomeType.SALE_OTHER,
          amount: '20.00',
          date: new Date(),
          parishionerId: 'p-1',
          createdBy: 'admin@ipul.local',
        }),
      ),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);

    expect(incomeRepository.create).not.toHaveBeenCalled();
  });

  it('rejects linked tithe when parishioner does not exist', async () => {
    const incomeRepository = {
      create: jest.fn(),
      findMany: jest.fn(),
    };
    const parishionerReader = {
      existsById: jest.fn().mockResolvedValue(false),
    };
    const handler = new CreateIncomeHandler(
      incomeRepository,
      parishionerReader,
    );

    await expect(
      handler.execute(
        new CreateIncomeCommand({
          type: IncomeType.TITHE,
          amount: '25.00',
          date: new Date('2026-01-02'),
          parishionerId: 'p-1',
          description: 'Sunday',
          createdBy: 'admin@ipul.local',
        }),
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
