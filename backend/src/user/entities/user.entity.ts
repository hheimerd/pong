import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role as PrismaRole } from '@prisma/client';

export enum Role {
  User = 'User',
  Admin = 'Admin'
}

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  login: string;

  @Field(() => [Role])
  roles: Role[] | PrismaRole[];

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;

  @Field(() => [String])
  avatar?: string[];
}

