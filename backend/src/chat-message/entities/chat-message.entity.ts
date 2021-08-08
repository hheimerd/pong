import { ObjectType, Field } from '@nestjs/graphql';
import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class ChatMessage {
  id: string;

  @Field()
  created_at: Date;

  @Field()
  message: string;

  @Field()
  userId: number;

  @Field()
  chatId: number;
}
