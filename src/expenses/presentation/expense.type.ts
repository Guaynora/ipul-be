import { Field, ID, ObjectType } from '@nestjs/graphql';
import { FundSource } from '../../shared/presentation/graphql.types';

@ObjectType()
export class ExpenseTypeModel {
  @Field(() => ID)
  id!: string;

  @Field()
  description!: string;

  @Field()
  amount!: string;

  @Field()
  date!: Date;

  @Field()
  category!: string;

  @Field(() => FundSource)
  fundSource!: FundSource;

  @Field()
  createdBy!: string;
}
