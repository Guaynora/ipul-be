import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  EXPENSE_REPOSITORY,
  type ExpenseRepositoryPort,
} from '../ports/expense.repository.port';
import { CreateExpenseCommand } from './create-expense.command';

@Injectable()
@CommandHandler(CreateExpenseCommand)
export class CreateExpenseHandler implements ICommandHandler<CreateExpenseCommand> {
  constructor(
    @Inject(EXPENSE_REPOSITORY)
    private readonly expenseRepository: ExpenseRepositoryPort,
  ) {}

  async execute(command: CreateExpenseCommand) {
    const { amount, description, category, date } = command.payload;
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw new UnprocessableEntityException('amount must be greater than 0');
    }

    if (!description.trim()) {
      throw new UnprocessableEntityException('description must not be empty');
    }

    if (!category.trim()) {
      throw new UnprocessableEntityException('category must not be empty');
    }

    if (Number.isNaN(date.getTime())) {
      throw new UnprocessableEntityException('date must be valid');
    }

    return this.expenseRepository.create({
      ...command.payload,
      description: description.trim(),
      category: category.trim(),
    });
  }
}
