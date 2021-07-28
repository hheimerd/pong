import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(type => Chat)
  @ManyToOne((related) => Chat, (chat) => chat.messages )
  chat: Promise<Chat>;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @Column()
  message: string;

  @Field(type => User)
  @ManyToOne((related) => User)
  user: Promise<User>;
}
