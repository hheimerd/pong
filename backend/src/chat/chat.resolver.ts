import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { PolicyGuard } from 'src/policy/guards/policy.guard';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ChatMessage } from 'src/chat-message/entities/chat-message.entity';
import { PubSub } from 'apollo-server-express';

const pubSub = new PubSub();

@UseGuards(JwtAuthGuard, PolicyGuard)
@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

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
  updateChat(@Args('updateChatInput') updateChatInput: UpdateChatInput) {
    return this.chatService.update(updateChatInput.id, updateChatInput);
  }

  @Mutation(() => Chat)
  removeChat(@Args('id') id: string) {
    return this.chatService.remove(id);
  }

  @Subscription(returns => ChatMessage)
  messageAdded() {
    return pubSub.asyncIterator('messageAdded');
  }
}
