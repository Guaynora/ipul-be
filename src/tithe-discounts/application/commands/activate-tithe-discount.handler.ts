import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  TITHE_DISCOUNT_REPOSITORY,
  type TitheDiscountRepositoryPort,
} from '../ports/tithe-discount.repository.port';
import { ActivateTitheDiscountCommand } from './activate-tithe-discount.command';

@Injectable()
@CommandHandler(ActivateTitheDiscountCommand)
export class ActivateTitheDiscountHandler
  implements ICommandHandler<ActivateTitheDiscountCommand>
{
  constructor(
    @Inject(TITHE_DISCOUNT_REPOSITORY)
    private readonly titheDiscountRepository: TitheDiscountRepositoryPort,
  ) {}

  async execute(command: ActivateTitheDiscountCommand) {
    const existing = await this.titheDiscountRepository.findById(command.id);

    if (!existing) {
      throw new NotFoundException(
        `TitheDiscount with id "${command.id}" not found`,
      );
    }

    if (existing.status !== 'DRAFT') {
      throw new UnprocessableEntityException(
        `TitheDiscount must be in DRAFT status to activate, current status: ${existing.status}`,
      );
    }

    return this.titheDiscountRepository.activate(command.id);
  }
}
