import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class ChatMessage {
  id: string;

  @Field()
  created_at: Date;

  @Field()
  message: string;

  @Field(() => Int)
  userId: number;

  @Field()
  chatId: string;
}
