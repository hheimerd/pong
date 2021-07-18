import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

registerEnumType(Role, {
  name: 'Role',
});

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ length: 32 })
  @Field()
  name: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ unique: true, length: 32 })
  @Field()
  login: string;

  @Column()
  password: string;

  @Column('varchar', { array: true, default: [Role.User] })
  @Field(() => [Role])
  roles: Role[];
}
