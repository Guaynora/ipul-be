import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsDateString, IsEnum, IsString, MinLength } from 'class-validator';
import { FundSource } from '../../../shared/presentation/graphql.types';

registerEnumType(FundSource, { name: 'FundSource' });

@InputType()
export class CreateExpenseInput {
  @Field()
  @IsString()
  @MinLength(1)
  description!: string;

  @Field()
  @IsString()
  @MinLength(1)
  amount!: string;

  @Field()
  @IsDateString()
  date!: string;

  @Field()
  @IsString()
  @MinLength(1)
  category!: string;

  @Field(() => FundSource)
  @IsEnum(FundSource)
  fundSource!: FundSource;
}
