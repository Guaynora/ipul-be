import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateIncomeHandler } from './application/commands/create-income.handler';
import { INCOME_REPOSITORY } from './application/ports/income.repository.port';
import { PARISHIONER_READER } from './application/ports/parishioner-reader.port';
import { ListIncomesHandler } from './application/queries/list-incomes.handler';
import { PrismaIncomeRepository } from './infrastructure/prisma-income.repository';
import { PrismaParishionerReader } from './infrastructure/prisma-parishioner.reader';
import { IncomesResolver } from './presentation/incomes.resolver';

@Module({
  imports: [CqrsModule],
  providers: [
    IncomesResolver,
    CreateIncomeHandler,
    ListIncomesHandler,
    PrismaIncomeRepository,
    PrismaParishionerReader,
    {
      provide: INCOME_REPOSITORY,
      useExisting: PrismaIncomeRepository,
    },
    {
      provide: PARISHIONER_READER,
      useExisting: PrismaParishionerReader,
    },
  ],
})
export class IncomesModule {}
