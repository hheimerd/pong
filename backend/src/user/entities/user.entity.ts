import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

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

  @Column({ select: false })
  password: string;

  @Column('varchar', { array: true })
  @Field((type) => [Role])
  roles: Role[];
}
