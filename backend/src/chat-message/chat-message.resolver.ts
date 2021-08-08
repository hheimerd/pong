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
import { Inject } from '@nestjs/common';
import { RequestUser } from 'src/common/auth/entities/request-user.entitiy';
import { User } from 'src/user/entities/user.entity';

export const CHAT_MESSAGE_SUB_KEY = 'messageAdded';

@Resolver(() => ChatMessage)
export class ChatMessageResolver {
  constructor(
    private readonly chatMessageService: ChatMessageService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => Boolean)
  async createChatMessage(
    @Args('input') input: CreateChatMessageInput,
    @CurrentUser() user: RequestUser,
  ) {
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
