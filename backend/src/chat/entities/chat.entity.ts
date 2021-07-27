import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { ChatMessage } from 'src/chat-message/entities/chat-message.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatType } from './chat-type.enum';

registerEnumType(ChatType, { name: 'ChatType' });

@Entity()
@ObjectType()
export class Chat {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Field({ nullable: true })
  @Column()
  name?: string;
  
  @Field(type => [User])
  @ManyToMany(hasMany => User, (user) => user.chats)
  members: Promise<User[]>;
  
  @Field(type => [User],{ nullable: true })
  @ManyToMany(hasMany => User)
  admins?: Promise<User[]>;
  
  @Field(type => User,{ nullable: true })
  @ManyToOne(hasOne => User)
  owner?: Promise<User>;
  
  @Field(type => ChatType)
  @Column()
  type: ChatType;
  
  @Field()
  @Column({ default: false })
  is_private: boolean;
  
  @Field({ nullable: true })
  @Column()
  password?: string;
  
  @Field(type => [ChatMessage])
  @ManyToMany(hasMany => ChatMessage, message => message.chat)
  @JoinTable()
  messages: Promise<ChatMessage[]>;
}
