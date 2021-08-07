import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
export class User {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  login: string;

  @Field(() => [Role])
  roles: Role[];

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => [String])
  avatar?: string[];
}
