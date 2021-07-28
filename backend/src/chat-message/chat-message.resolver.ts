import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChatMessageService } from './chat-message.service';
import { ChatMessage } from './entities/chat-message.entity';
import { CreateChatMessageInput } from './dto/create-chat-message.input';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { PubSub } from 'apollo-server-express';

const pubSub = new PubSub();

@Resolver(() => ChatMessage)
export class ChatMessageResolver {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @Mutation(() => Boolean)
  createChatMessage(
    @Args('createChatMessageInput') createChatMessageInput: CreateChatMessageInput,
    @CurrentUser() user: User
    ) {
      const message = this.chatMessageService.create(createChatMessageInput, user);
      pubSub.publish('messageAdded', { messageAdded: message });
      return true;
  }

  @Query(() => ChatMessage, { name: 'chatMessage' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.chatMessageService.findOne(id);
  }
}
