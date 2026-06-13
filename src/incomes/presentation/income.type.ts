import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IncomeType } from '@prisma/client';

@ObjectType()
export class IncomeTypeModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  type!: IncomeType;

  @Field()
  amount!: string;

  @Field()
  date!: Date;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => String, { nullable: true })
  parishionerId!: string | null;

  @Field()
  createdBy!: string;
}
