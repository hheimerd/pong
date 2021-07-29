import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChatMessageService } from './chat-message.service';
import { ChatMessage } from './entities/chat-message.entity';
import { CreateChatMessageInput } from './dto/create-chat-message.input';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { PubSub } from 'graphql-subscriptions'; 
import { Inject } from '@nestjs/common';

export const CHAT_MESSAGE_SUBSCRIBE_KEY = 'messageAdded';

@Resolver(() => ChatMessage)
export class ChatMessageResolver {
  constructor(
    private readonly chatMessageService: ChatMessageService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub
    ) {}

  @Mutation(() => Boolean)
  async createChatMessage(
    @Args('input') input: CreateChatMessageInput,
    @CurrentUser() user: User
    ) {
      const message = await this.chatMessageService.create(input, user);
      this.pubSub.publish(CHAT_MESSAGE_SUBSCRIBE_KEY, { messageAdded: message });
      return true;
  }

  @Query(() => ChatMessage, { name: 'chatMessage' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.chatMessageService.findOne(id);
  }
}
