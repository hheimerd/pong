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
import { Chat, ChatType, PunishmentDegree } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { JwtAuthGuard } from 'src/common/auth/guards/jwt-auth.guard';
import {
  ForbiddenException,
  NotFoundException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PolicyGuard } from 'src/common/policy/guards/policy.guard';
import { CurrentUser } from 'src/common/auth/decorators/current-user.decorator';
import { RequestUser } from 'src/common/auth/entities/request-user.entitiy';
import { ChatMessage } from 'src/chat-message/entities/chat-message.entity';
import { User } from 'src/user/entities/user.entity';
import { ChatPunishment } from './entities/chat-punishment.entity';

@UseGuards(JwtAuthGuard, PolicyGuard)
@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @UsePipes(ValidationPipe)
  @Mutation(() => Chat, { name: 'createChat' })
  create(
    @Args('createChatInput') dto: CreateChatInput,
    @CurrentUser() user: RequestUser,
  ) {
    if (dto.type == ChatType.Chat) {
      dto.name = null;
      dto.password = null;
    }
    return this.chatService.create(dto, user.id);
  }

  @Query(() => [Chat], { name: 'chats' })
  findAll(
    @Args('limit', {type: () => Int, nullable: true, description: 'max limit 100'})
    limit = 15,
    @Args('offset', { type: () => Int, nullable: true })
    offset?: number,
  ) {
    if (limit > 100) limit = 100;
    if (limit < 0) limit = 15;
    return this.chatService.findAll({ is_private: false}, limit, offset);
  }

  @Query(() => Chat, { name: 'chat' })
  async findOne(@Args('id') id: string) {
    const chat = await this.chatService.findOne(id);
    if (!chat) throw new NotFoundException();

    return chat;
  }

  private async throwUnlessMember(chatId, userId) {
    const isMember = await this.chatService.isChatMember(chatId, userId);
    if (!isMember) {
      throw new ForbiddenException();
    }
  }
 
  @ResolveField('dialogName', () => String)
  async getDialogName(@Parent() chat: Chat, @CurrentUser() user: RequestUser) {
    if (chat.type === ChatType.Chat) {
      const members = await this.getMembers(chat);
      return members.find((member) => member.id != user.id).name;
    }
    return chat.name;
  }

  @ResolveField('messages', () => [ChatMessage])
  async getMessages(
    @Parent() chat: Chat,
    @Args('limit', { type: () => Int, nullable: true, description: 'max limit 100' })
    limit = 15,
    @Args('offset', { type: () => Int, nullable: true })
    offset?: number,
    @CurrentUser() user?: RequestUser,
  ) {
    if (limit > 100) limit = 100;
    if (limit < 0) limit = 15;

    await this.throwUnlessMember(chat.id, user.id);

    return this.chatService.getMessages(chat.id, limit, offset);
  }

  @ResolveField('punishments', () => [ChatPunishment])
  async getPunishments(
    @Parent() chat: Chat, 
    @Args('degree', { type: () => PunishmentDegree, nullable: true}) degree: PunishmentDegree
  ) {
    return await this.chatService.getPunishments(chat.id, degree);
  }

  @ResolveField('hasPassword', () => Boolean)
  hasPassword(@Parent() chat: Chat) {
    return !!chat.password;
  }

  @ResolveField('members', () => [User])
  async getMembers(@Parent() chat: Chat) {
    return await this.chatService.getMembers(chat.id);
  }

  @ResolveField('admins', () => [User])
  async getAdmins(@Parent() chat: Chat) {
    return this.chatService.getAdmins(chat.id);
  }

  @UsePipes(ValidationPipe)
  @Mutation(() => Chat)
  updateChat(@Args('input') input: UpdateChatInput) {
    return this.chatService.update(input.id, input);
  }

}
