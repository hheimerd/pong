import { NotFoundException, ParseIntPipe, UnauthorizedException } from "@nestjs/common";
import { Args, Int, Mutation, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "src/common/auth/decorators/current-user.decorator";
import { RequestUser } from "src/common/auth/entities/request-user.entitiy";
import { PasswordService } from "src/common/password/password.service";
import { UserService } from "src/user/user.service";
import { ChatService } from "./chat.service";

@Resolver()
export class ChatActionsResolver {
  constructor(private readonly chatService: ChatService) {}
 


  @Mutation(() => Boolean)
  async banUserInChat(
    @Args('chatId') chatId: string,
    @Args('userId', { type: () => Int }, ParseIntPipe) userId: number,
    @Args('minutes', { type: () => Int, nullable: true }) minutes = 5,
    @CurrentUser() user?: RequestUser,
  ): Promise<boolean> {
    const chat = await this.chatService.findOne(chatId);
    if (!chat) throw new NotFoundException();

    if (chat.ownerId == userId) throw new UnauthorizedException();

    const isAdmin = this.chatService.isChatAdmin(chatId, user.id);
    if (!isAdmin) throw new UnauthorizedException();

    await this.chatService.banUser(chatId, userId, minutes);
    return true;
  }

  @Mutation(() => Boolean)
  async unbanUserInChat(
    @Args('chatId') chatId: string,
    @Args('userId', { type: () => Int }, ParseIntPipe) userId: number,
    @CurrentUser() user?: RequestUser,
  ): Promise<boolean> {
    const isAdmin = this.chatService.isChatAdmin(chatId, user.id);
    if (!isAdmin) throw new UnauthorizedException();

    await this.chatService.unbanUser(chatId, userId);
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
      const isAdmin = await this.chatService.isChatAdmin(chatId, user.id);

      if (!isAdmin) {
        if (chat.is_private) throw new UnauthorizedException();
        if (!password?.length) throw new UnauthorizedException();

        const isValid = await PasswordService.isValid(password, chat.password);
        if (!isValid) throw new UnauthorizedException();
      }  
    }

    await this.chatService.addToChat(chat.id, user.id)
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