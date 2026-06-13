import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { DiscountStatus } from '../../shared/presentation/graphql.types';

@ObjectType()
export class TitheDiscountTypeModel {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  version!: number;

  @Field(() => DiscountStatus)
  status!: DiscountStatus;

  @Field()
  effectiveFrom!: Date;

  @Field()
  rules!: string;

  @Field()
  createdBy!: string;

  @Field()
  createdAt!: Date;

  @Field(() => Date, { nullable: true })
  activatedAt!: Date | null;
}
