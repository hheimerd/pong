import { ObjectType, Field, registerEnumType, Int } from '@nestjs/graphql';
import { ChatMessage } from 'src/chat-message/entities/chat-message.entity';
import { ChatType as PrismaChatType } from '@prisma/client';
import { ChatService } from '../chat.service';
import { CurrentUser } from 'src/common/auth/decorators/current-user.decorator';
import { RequestUser } from 'src/common/auth/entities/request-user.entitiy';

export enum ChatType {
  Chat = 'Chat',
  Channel = 'Channel',
}
registerEnumType(ChatType, { name: 'ChatType' });

@ObjectType()
export class Chat {
  constructor(chatService: ChatService) {}

  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Int)
  ownerId: number;

  @Field((type) => ChatType)
  type: ChatType;

  @Field()
  is_private: boolean;

  @Field((type) => [ChatMessage], { defaultValue: [] })
  messages: ChatMessage[];

  password: string;

}
