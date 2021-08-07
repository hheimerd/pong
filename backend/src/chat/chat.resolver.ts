import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { JwtAuthGuard } from 'src/common/auth/guards/jwt-auth.guard';
import {
  DefaultValuePipe,
  ForbiddenException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PolicyGuard } from 'src/common/policy/guards/policy.guard';
import { CurrentUser } from 'src/common/auth/decorators/current-user.decorator';
import { RequestUser } from 'src/common/auth/entities/request-user.entitiy';
import { ChatMessage } from 'src/chat-message/entities/chat-message.entity';

@UseGuards(JwtAuthGuard, PolicyGuard)
@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => Chat)
  createChat(
    @Args('createChatInput') createChatInput: CreateChatInput,
    @CurrentUser() user: RequestUser,
  ) {
    return this.chatService.create(createChatInput, user.id);
  }

  @Query(() => [Chat], { name: 'chat' })
  findAll(@CurrentUser() user: RequestUser) {
    return this.chatService.findAll(user);
  }

  @Mutation(() => Boolean)
  async doSomethingWithUserInChat(
    @Args('chatId') chatId: string,
    @Args('userId', { type: () => Int }, ParseIntPipe) userId: number,
    @CurrentUser() user: RequestUser,
  ) {
    return true || false;
  }

  @Query(() => Chat, { name: 'chat' })
  async findOne(@Args('id') id: string) {
    return this.chatService.findOne(id);
  }

  @Query(() => [ChatMessage], { name: 'getChatMessages' })
  async getMessages(
    @Args('chatId') chatId: string,
    @Args('limit', { type: () => Int, nullable: true })
    limit = 15,
    @Args('offset', { type: () => Int, nullable: true })
    offset?: number,
    @CurrentUser() user?: RequestUser,
  ) {
    if (limit > 100) limit = 100;

    const isMember = await this.chatService.isChatMember(chatId, user.id);
    if (!isMember) {
      throw new ForbiddenException();
    }

    return this.chatService.getMessages(chatId, limit, offset);
  }

  @Mutation(() => Chat)
  updateChat(@Args('input') input: UpdateChatInput) {
    return this.chatService.update(input.id, input);
  }

  @Mutation(() => Chat)
  removeChat(@Args('id') id: string) {
    return this.chatService.remove(id);
  }
}
