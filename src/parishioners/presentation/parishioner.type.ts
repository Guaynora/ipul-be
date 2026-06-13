import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ParishionerType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => String, { nullable: true })
  email!: string | null;

  @Field(() => String, { nullable: true })
  phone!: string | null;

  @Field(() => String, { nullable: true })
  address!: string | null;

  @Field()
  baptized!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
