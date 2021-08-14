import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async unbanUser(chatId: string, userId: number) {
    await this.prisma.chatsBannedUsers.delete({
      where: {
        userId_chatId: {
          chatId,
          userId,
        },
      },
    });
  }

  async getbanned(chatId: string) {
    return await this.prisma.user.findMany({
      where: {
        bannedChats: {
          some: {
            chatId: chatId,
          },
        },
      },
    });
  }

  async banUser(chatId: string, userId: number, minutes: number) {
    await this.prisma.chatsBannedUsers.create({
      data: {
        userId: userId,
        chatId: chatId,
        minutes: minutes,
      },
    });
  }

  async getMembers(id: string) {
    return await this.prisma.user.findMany({
      where: {
        chats: {
          some: { id },
        },
      },
    });
  }

  async getAdmins(id: string) {
    return await this.prisma.user.findMany({
      where: {
        adminChats: {
          some: { id },
        },
      },
    });
  }

  async getMessages(chatId: string, limit: number, offset: number) {
    const result = this.prisma.chatMessage.findMany({
      where: { chat: { id: chatId } },
      take: limit,
      skip: offset,
      orderBy: {
        created_at: 'desc',
      },
    });

    return await result;
  }

  async isChatMember(chatId: string, userId: number): Promise<boolean> {
    const result = await this.prisma.chat.count({
      where: {
        id: chatId,
        members: {
          some: {
            id: userId,
          },
        },
      },
    });

    return !!result;
  }

  async create(input: CreateChatInput, ownerId: number) {
    const admins = input.admins?.length > 0 
      ? input.admins 
      : [ownerId];
    return await this.prisma.chat.create({
      data: {
        name: input.name,
        password: input.password,
        is_private: input.is_private,
        type: input.type,
        admins: {
          connect: admins.map((adminId) => ({ id: adminId })),
        },
        members: {
          connect: input.members.map((memberId) => ({ id: memberId })),
        },
        owner: {
          connect: { id: ownerId },
        },
      },
    });
  }

  async findAll(whereClause: Prisma.ChatWhereInput) {
    return await this.prisma.chat.findMany({
      where: whereClause,
    });
  }

  async findOne(id: string) {
    return await this.prisma.chat.findUnique({
      where: { id: id },
      include: { owner: true },
    });
  }

  async update(id: string, updateChatInput: UpdateChatInput) {
    const { admins, members, ...other } = updateChatInput;
    return await this.prisma.chat.update({
      where: { id },
      data: {
        ...other,
        admins: {
          set: admins?.map((adminId) => ({ id: adminId })),
        },
        members: {
          set: members?.map((memberId) => ({ id: memberId })),
        },
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.chat.delete({ where: { id } });
  }
}
