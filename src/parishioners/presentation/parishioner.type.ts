import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ParishionerType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  email!: string | null;

  @Field({ nullable: true })
  phone!: string | null;

  @Field({ nullable: true })
  address!: string | null;

  @Field()
  baptized!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
