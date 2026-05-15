import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IncomeType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

registerEnumType(IncomeType, { name: 'IncomeType' });

@InputType()
export class CreateIncomeInput {
  @Field(() => IncomeType)
  @IsEnum(IncomeType)
  type!: IncomeType;

  @Field()
  @IsString()
  @MinLength(1)
  amount!: string;

  @Field()
  @IsDateString()
  date!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  parishionerId?: string | null;
}
