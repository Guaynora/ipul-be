import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsDateString, IsString, MinLength } from 'class-validator';
import { DiscountStatus } from '../../../shared/presentation/graphql.types';

registerEnumType(DiscountStatus, { name: 'DiscountStatus' });

@InputType()
export class CreateTitheDiscountInput {
  @Field()
  @IsDateString()
  effectiveFrom!: string;

  @Field()
  @IsString()
  @MinLength(2)
  rules!: string;
}
