import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsOptional } from 'class-validator';

@InputType()
export class ReportFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  from?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  to?: string;
}
