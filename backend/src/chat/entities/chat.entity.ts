import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { ChatMessage } from 'src/chat-message/entities/chat-message.entity';
import { ChatType } from '@prisma/client';

registerEnumType(ChatType, { name: 'ChatType' });

@ObjectType()
export class Chat {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  ownerId: number;

  @Field((type) => ChatType)
  type: ChatType;

  @Field()
  is_private: boolean;

  @Field((type) => [ChatMessage], { defaultValue: [] })
  messages: ChatMessage[];

  password: string;
}
