import { Field, ObjectType } from '@nestjs/graphql';
import { FundSource, IncomeType } from '../../shared/presentation/graphql.types';

@ObjectType()
export class IncomeByTypeModel {
  @Field(() => IncomeType)
  type!: string;

  @Field()
  total!: string;
}

@ObjectType()
export class IncomeReportModel {
  @Field(() => [IncomeByTypeModel])
  byType!: IncomeByTypeModel[];

  @Field()
  grandTotal!: string;
}

@ObjectType()
export class ExpenseByFundModel {
  @Field(() => FundSource)
  fundSource!: string;

  @Field()
  total!: string;
}

@ObjectType()
export class ExpenseByCategoryModel {
  @Field()
  category!: string;

  @Field()
  total!: string;
}

@ObjectType()
export class ExpenseReportModel {
  @Field(() => [ExpenseByFundModel])
  byFund!: ExpenseByFundModel[];

  @Field(() => [ExpenseByCategoryModel])
  byCategory!: ExpenseByCategoryModel[];

  @Field()
  grandTotal!: string;
}

@ObjectType()
export class FundBalanceModel {
  @Field(() => FundSource)
  fund!: string;

  @Field()
  totalIncome!: string;

  @Field()
  totalExpense!: string;

  @Field()
  net!: string;
}

@ObjectType()
export class BalanceReportModel {
  @Field(() => [FundBalanceModel])
  byFund!: FundBalanceModel[];

  @Field()
  totalIncome!: string;

  @Field()
  totalExpense!: string;

  @Field()
  netBalance!: string;
}
