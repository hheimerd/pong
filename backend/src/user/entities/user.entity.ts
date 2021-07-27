import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Chat } from 'src/chat/entities/chat.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';

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
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 32 })
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ unique: true, length: 32 })
  login: string;

  @Column()
  password: string;

  @Field(() => [Role])
  @Column('varchar', { array: true, default: [Role.User] })
  roles: Role[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => [String])
  @Column('string', { array: true })
  avatar?: string[];

  @Field(() => [Chat])
  @ManyToMany(hasMany => Chat, chat => chat.members)
  chats: Promise<Chat[]>
}
