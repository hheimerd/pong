import { ObjectType, Field, registerEnumType, Int } from '@nestjs/graphql';
import { ChatMessage } from 'src/chat-message/entities/chat-message.entity';
import { ChatService } from '../chat.service';



export enum PunishmentDegree {
  BAN = "BAN",
  MUTE = "MUTE",
  SELF_MUTE = "SELF_MUTE"
}
registerEnumType(PunishmentDegree, { name: 'PunishmentDegree' });

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
