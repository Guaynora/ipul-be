import { Field, InputType, PartialType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateParishionerInput {
  @Field()
  @IsString()
  @MinLength(1)
  name!: string;

  @Field()
  @IsBoolean()
  baptized!: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Matches(/^\+?[0-9\-\s]{7,20}$/)
  phone?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  address?: string | null;
}

@InputType()
export class UpdateParishionerInput extends PartialType(
  CreateParishionerInput,
) {}
