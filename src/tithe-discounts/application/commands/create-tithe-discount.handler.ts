import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  TITHE_DISCOUNT_REPOSITORY,
  type TitheDiscountRepositoryPort,
} from '../ports/tithe-discount.repository.port';
import { CreateTitheDiscountCommand } from './create-tithe-discount.command';

@Injectable()
@CommandHandler(CreateTitheDiscountCommand)
export class CreateTitheDiscountHandler
  implements ICommandHandler<CreateTitheDiscountCommand>
{
  constructor(
    @Inject(TITHE_DISCOUNT_REPOSITORY)
    private readonly titheDiscountRepository: TitheDiscountRepositoryPort,
  ) {}

  async execute(command: CreateTitheDiscountCommand) {
    const { effectiveFrom, rules, createdBy } = command.payload;

    if (Number.isNaN(effectiveFrom.getTime())) {
      throw new UnprocessableEntityException('effectiveFrom must be a valid date');
    }

    let parsedRules: Record<string, unknown>;
    try {
      parsedRules = JSON.parse(rules);
    } catch {
      throw new UnprocessableEntityException('rules must be valid JSON');
    }

    if (
      typeof parsedRules !== 'object' ||
      parsedRules === null ||
      Array.isArray(parsedRules)
    ) {
      throw new UnprocessableEntityException('rules must be a non-empty JSON object');
    }

    if (Object.keys(parsedRules).length === 0) {
      throw new UnprocessableEntityException('rules must be a non-empty JSON object');
    }

    return this.titheDiscountRepository.create({
      effectiveFrom,
      rules: parsedRules,
      createdBy,
    });
  }
}
