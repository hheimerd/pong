import {
  Resolver,
  Mutation,
  Args,
  Subscription,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ChatMessageService } from './chat-message.service';
import { ChatMessage } from './entities/chat-message.entity';
import { CreateChatMessageInput } from './dto/create-chat-message.input';
import { CurrentUser } from 'src/common/auth/decorators/current-user.decorator';
import { PubSub } from 'graphql-subscriptions';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { RequestUser } from 'src/common/auth/entities/request-user.entitiy';
import { User } from 'src/user/entities/user.entity';
import { ChatService } from 'src/chat/chat.service';
import { PunishmentDegree } from 'src/chat/entities/chat.entity';

export const CHAT_MESSAGE_SUB_KEY = 'messageAdded';

@Resolver(() => ChatMessage)
export class ChatMessageResolver {
  constructor(
    private readonly chatMessageService: ChatMessageService,
    private readonly chatService: ChatService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => Boolean)
  async createChatMessage(
    @Args('input') input: CreateChatMessageInput,
    @CurrentUser() user: RequestUser,
  ) {

    const isMuted = await this.chatService.isPunished(input.chatId, user.id, PunishmentDegree.MUTE);
    if (isMuted) throw new UnauthorizedException("You muted in this channel");

    const message = await this.chatMessageService.create(input, user.id);

    this.pubSub.publish(CHAT_MESSAGE_SUB_KEY, { messageAdded: message });
    return true;
  }

  @Subscription(() => ChatMessage, {
    filter: (payload, variables) => {
      return payload.messageAdded.chatId == variables.chatId;
    },
  })
  async messageAdded(
    @Args('chatId') chatId: string,
    @Args('token') token: string,
  ) {
    return await this.pubSub.asyncIterator<ChatMessage>(CHAT_MESSAGE_SUB_KEY);
  }
}
