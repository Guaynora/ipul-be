import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateParishionerHandler } from './application/commands/create-parishioner.handler';
import { DeleteParishionerHandler } from './application/commands/delete-parishioner.handler';
import { PARISHIONER_REPOSITORY } from './application/ports/parishioner.repository.port';
import { UpdateParishionerHandler } from './application/commands/update-parishioner.handler';
import { GetParishionerHandler } from './application/queries/get-parishioner.handler';
import { ListParishionersHandler } from './application/queries/list-parishioners.handler';
import { PrismaParishionerRepository } from './infrastructure/prisma-parishioner.repository';
import { ParishionersResolver } from './presentation/parishioners.resolver';

const commandHandlers = [
  CreateParishionerHandler,
  UpdateParishionerHandler,
  DeleteParishionerHandler,
];
const queryHandlers = [GetParishionerHandler, ListParishionersHandler];

@Module({
  imports: [CqrsModule],
  providers: [
    ParishionersResolver,
    ...commandHandlers,
    ...queryHandlers,
    PrismaParishionerRepository,
    {
      provide: PARISHIONER_REPOSITORY,
      useExisting: PrismaParishionerRepository,
    },
  ],
})
export class ParishionersModule {}
