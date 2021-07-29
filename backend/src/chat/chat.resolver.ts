import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { PolicyGuard } from 'src/policy/guards/policy.guard';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ChatMessage } from 'src/chat-message/entities/chat-message.entity';
import { PubSub } from 'graphql-subscriptions'; 
import { AuthService } from 'src/auth/auth.service';
import { CHAT_MESSAGE_SUBSCRIBE_KEY } from 'src/chat-message/chat-message.resolver';


@UseGuards(JwtAuthGuard, PolicyGuard)
@Resolver(() => Chat)
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    @Inject(forwardRef(() => 'PUB_SUB'))
    private readonly pubSub: PubSub
    ) {}

  @Mutation(() => Chat)
  createChat(
    @Args('createChatInput') createChatInput: CreateChatInput, 
    @CurrentUser() user: User
    ) {
    return this.chatService.create(createChatInput, user);
  }

  @Query(() => [Chat], { name: 'chat' })
  findAll(@CurrentUser() user: User) {
    return this.chatService.findAll(user);
  }

  @Query(() => Chat, { name: 'chat' })
  findOne(@Args('id') id: string) {
    return this.chatService.findOne(id);
  }

  @Mutation(() => Chat)
  updateChat(@Args('input') input: UpdateChatInput) {
    return this.chatService.update(input.id, input);
  }

  @Mutation(() => Chat)
  removeChat(@Args('id') id: string) {
    return this.chatService.remove(id);
  }

  @Subscription(returns => ChatMessage, { 
    filter: (payload, variables) => {
      return payload.messageAdded.chat.id == variables.id
    }
  })
  async messageAdded(@Args('chatId') id: string, @Args('token') token: string) {
    return await this.pubSub.asyncIterator<ChatMessage>(CHAT_MESSAGE_SUBSCRIBE_KEY);
  }
}
