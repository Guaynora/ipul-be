import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  INCOME_REPOSITORY,
  type IncomeRepositoryPort,
} from '../ports/income.repository.port';
import {
  PARISHIONER_READER,
  type ParishionerReaderPort,
} from '../ports/parishioner-reader.port';
import { CreateIncomeCommand } from './create-income.command';

@Injectable()
@CommandHandler(CreateIncomeCommand)
export class CreateIncomeHandler implements ICommandHandler<CreateIncomeCommand> {
  constructor(
    @Inject(INCOME_REPOSITORY)
    private readonly incomeRepository: IncomeRepositoryPort,
    @Inject(PARISHIONER_READER)
    private readonly parishionerReader: ParishionerReaderPort,
  ) {}

  async execute(command: CreateIncomeCommand) {
    const { type, parishionerId } = command.payload;
    if ((type === 'OFFERING' || type === 'SALE_OTHER') && parishionerId) {
      throw new UnprocessableEntityException(
        'parishionerId is only allowed for TITHE',
      );
    }

    if (type === 'TITHE' && parishionerId) {
      const found = await this.parishionerReader.existsById(parishionerId);
      if (!found) {
        throw new NotFoundException('parishioner not found');
      }
    }

    return this.incomeRepository.create({
      type,
      amount: command.payload.amount,
      date: command.payload.date,
      description: command.payload.description ?? null,
      parishionerId: command.payload.parishionerId ?? null,
      createdBy: command.payload.createdBy,
    });
  }
}
