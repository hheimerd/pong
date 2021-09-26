import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role as PrismaRole, UserStatus as PrismaUserStatus } from '@prisma/client';

export enum Role {
  User = 'User',
  Admin = 'Admin'
}

registerEnumType(Role, {
  name: 'Role',
});

export enum UserStatus {
  Online = "Online",
  Offline = "Offline",
  InGame = "InGame"
}
registerEnumType(UserStatus, {
  name: 'UserStatus',
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

  @Field(() => Boolean)
  TwoFactorAuth?;

  @Field(() => UserStatus)
  status: UserStatus | PrismaUserStatus;
}

