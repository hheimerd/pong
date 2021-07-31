import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { ChatMessage } from 'src/chat-message/entities/chat-message.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatType } from './chat-type.enum';

registerEnumType(ChatType, { name: 'ChatType' });

@Entity()
@ObjectType()
export class Chat {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field((type) => [User])
  @ManyToMany((hasMany) => User, (user) => user.chats)
  @JoinTable()
  members: Promise<User[]>;

  @Field((type) => [User], { nullable: true })
  @ManyToMany((hasMany) => User, { nullable: true })
  @JoinTable()
  admins?: Promise<User[]>;

  @Field((type) => User, { nullable: true })
  @ManyToOne((hasOne) => User, { nullable: true })
  owner?: Promise<User>;

  @Field((type) => ChatType)
  @Column()
  type: ChatType;

  @Field()
  @Column({ default: false })
  is_private: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  password?: string;

  @Field((type) => [ChatMessage])
  @OneToMany((hasMany) => ChatMessage, (message) => message.chat)
  messages: Promise<ChatMessage[]>;
}
