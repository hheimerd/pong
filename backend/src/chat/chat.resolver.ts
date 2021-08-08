import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { JwtAuthGuard } from 'src/common/auth/guards/jwt-auth.guard';
import {
  DefaultValuePipe,
  ForbiddenException,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PolicyGuard } from 'src/common/policy/guards/policy.guard';
import { CurrentUser } from 'src/common/auth/decorators/current-user.decorator';
import { RequestUser } from 'src/common/auth/entities/request-user.entitiy';
import { ChatMessage } from 'src/chat-message/entities/chat-message.entity';
import { User } from 'src/user/entities/user.entity';

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

  @Query(() => [Chat], { name: 'chats' })
  findAll() {
    return this.chatService.findAll({ is_private: false });
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
    const chat = await this.chatService.findOne(id);
    if (!chat) throw new NotFoundException();

    return chat;
  }

  @Mutation(() => Boolean)
  async banUserInChat(
    @Args('chatId') chatId: string,
    @Args('userId', { type: () => Int }, ParseIntPipe) userId: number,
    @Args('minutes', { type: () => Int, nullable: true }) minutes = 5,
  ): Promise<boolean> {
    await this.chatService.banUser(chatId, userId, minutes);
    return true;
  }

  @Mutation(() => Boolean)
  async unbanUserInChat(
    @Args('chatId') chatId: string,
    @Args('userId', { type: () => Int }, ParseIntPipe) userId: number,
  ): Promise<boolean> {
    await this.chatService.unbanUser(chatId, userId);
    return true;
  }

  @ResolveField('messages', () => [ChatMessage])
  async getMessages(
    @Parent() chat: Chat,
    @Args('limit', {
      type: () => Int,
      nullable: true,
      description: 'max limit 100',
    })
    limit = 15,
    @Args('offset', { type: () => Int, nullable: true })
    offset?: number,
    @CurrentUser() user?: RequestUser,
  ) {
    if (limit > 100) limit = 100;
    if (limit < 0) limit = 15;

    await this.checkIsMember(chat.id, user.id);

    return this.chatService.getMessages(chat.id, limit, offset);
  }

  @ResolveField('members', () => [User])
  async getMembers(@Parent() chat: Chat) {
    const members = await this.chatService.getMembers(chat.id);

    return members;
  }

  @ResolveField('banned', () => [User])
  async getBanned(@Parent() chat: Chat) {
    const banned = await this.chatService.getbanned(chat.id);

    return banned;
  }

  @ResolveField('admins', () => [User])
  async getAdmins(@Parent() chat: Chat) {
    return this.chatService.getAdmins(chat.id);
  }

  @Mutation(() => Chat)
  updateChat(@Args('input') input: UpdateChatInput) {
    return this.chatService.update(input.id, input);
  }

  @Mutation(() => Chat)
  removeChat(@Args('id') id: string) {
    return this.chatService.remove(id);
  }

  private async checkIsMember(chatId, userId) {
    const isMember = await this.chatService.isChatMember(chatId, userId);
    if (!isMember) {
      throw new ForbiddenException();
    }
  }
}
