import { NotFoundException, ParseIntPipe, UnauthorizedException } from "@nestjs/common";
import { Args, Int, Mutation, Resolver, Query } from "@nestjs/graphql";
import { Cron } from "@nestjs/schedule";
import { Chat } from "@prisma/client";
import { CurrentUser } from "src/common/auth/decorators/current-user.decorator";
import { RequestUser } from "src/common/auth/entities/request-user.entitiy";
import { PasswordService } from "src/common/password/password.service";
import { UserService } from "src/user/user.service";
import { ChatService } from "./chat.service";
import { ChatPunishment } from "./entities/chat-punishment.entity";
import { PunishmentDegree } from "./entities/chat.entity";

@Resolver()
export class ChatActionsResolver {
  constructor(private readonly chatService: ChatService) {}
 
  @Cron('60 * * * * *')
  clearOldPunishments() {
    this.chatService.clearOldPunishments();
  }


  async canPunish(
    chat: Chat,
    punisherId: number,
    degree: PunishmentDegree,
    targetId: number
  ): Promise<boolean> {
    if (degree === PunishmentDegree.SELF_MUTE) return true;
    if (punisherId == chat.ownerId) return true;

    if (targetId == chat.ownerId) return false;

    const punisherIsAdmin = await this.chatService.isChatAdmin(chat.id, punisherId);
    if (!punisherIsAdmin) return false;

    const targetIsAdmin = await this.chatService.isChatAdmin(chat.id, targetId);
    if (targetIsAdmin) return false;
    
    return true;
  }

  @Mutation(() => Boolean)
  async addUserPunishmentInChat(
    @Args('chatId') chatId: string,
    @Args('targetUserId', { type: () => Int }, ParseIntPipe) targetUserId: number,
    @Args('degree', { type: () => PunishmentDegree}) degree: PunishmentDegree,
    @Args('minutes', { type: () => Int, nullable: true }) minutes = 5,
    @CurrentUser() user?: RequestUser,
  ): Promise<boolean> {
    const chat = await this.chatService.findOne(chatId);
    if (!chat) throw new NotFoundException();

    const canPunish = await this.canPunish(chat, user.id, degree, targetUserId);

    if (!canPunish) throw new UnauthorizedException();

    if (degree === PunishmentDegree.BAN) {
      await this.chatService.removeFromChat(chatId, targetUserId);
    } 

    await this.chatService.addPunishment(chat.id, user.id, degree, targetUserId, minutes);
    return true;
  }

  @Mutation(() => Boolean)
  async removeUserPunishmentInChat(
    @Args('chatId') chatId: string,
    @Args('targetUserId', { type: () => Int }, ParseIntPipe) targetUserId: number,
    @Args('degree', { type: () => PunishmentDegree}) degree: PunishmentDegree,
    @CurrentUser() user?: RequestUser,
  ): Promise<boolean> {
    const chat = await this.chatService.findOne(chatId);
    if (!chat) throw new NotFoundException();

    const canPunish = await this.canPunish(chat, user.id, degree, targetUserId);

    if (!canPunish) throw new UnauthorizedException();

    await this.chatService.removePunishmentByParams(chat.id, degree, targetUserId);
    return true;
  }

  @Mutation(() => Boolean)
  async addMemberToChat(
    @Args('chatId') chatId: string, 
    @Args('userId', { nullable: true, type: () => Int }) 
    userId?: number,
    @Args('password', { nullable: true }) password?: string,
    @CurrentUser() user?: RequestUser,
  ) 
  {
    const chat = await this.chatService.findOne(chatId);
    if (!chat) throw new NotFoundException();

    if (chat.is_private || chat.password?.length) {
      const isAdmin = userId && await this.chatService.isChatAdmin(chatId, user.id);

      if (!isAdmin) {
        if (chat.is_private) throw new UnauthorizedException();
        if (!password?.length) throw new UnauthorizedException();

        const isValid = await PasswordService.isValid(password, chat.password);
        if (!isValid) throw new UnauthorizedException();
      }  
    }
    
    const bannedPunishments = await this.chatService.getPunishments(chat.id, PunishmentDegree.BAN);
    const isBanned = bannedPunishments.find((p) => p.toUserId == user.id);
    if (isBanned) throw new UnauthorizedException("You banned");

    await this.chatService.addToChat(chat.id, userId)
    return true;
  }

  @Mutation(() => Boolean)
  async removeMemberFromChat(
    @Args('chatId') chatId: string, 
    @Args('userId', { nullable: true, type: () => Int, description: "default: current user" }) 
    userId?: number,
    @CurrentUser() user?: RequestUser,
  ) 
  {
    const chat = await this.chatService.findOne(chatId);
    if (!chat) throw new NotFoundException();

    if (userId) {
      const isAdmin = await this.chatService.isChatAdmin(chatId, user.id);
      if (!isAdmin && userId != user.id) throw new UnauthorizedException();
    } else {
      userId = user.id;
    }

    await this.chatService.removeFromChat(chatId, userId)
    return true;
  }
}