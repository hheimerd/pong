import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma, PunishmentDegree as PrismaPunishmentDegree } from '@prisma/client';
import { PasswordService } from 'src/common/password/password.service';
import { PunishmentDegree } from './entities/chat.entity';
import moment from 'moment';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}
  
  async clearOldPunishments() {
    const lastWeek = moment().subtract(7, 'days');

    const allLastPunishments = await this.prisma.chatPunishment.findMany({
      where: { 
        created_at: {
          lte: lastWeek.toDate(),
        }
      }
    })
    
    const invalidPunishments = allLastPunishments.filter(p => {
      const invalidateTime = moment(p.created_at).add(p.minutes, 'minutes');
      if (invalidateTime < moment()) {
        return true;
      }
      return false;
    });

    const idForRemove = invalidPunishments.map((p) => p.id);
    this.prisma.chatPunishment.deleteMany({
      where: {
        id: {
          in: idForRemove
        }
      }
    })

  }

  async addToChat(chatId: string, userId: number) {
    await this.prisma.chat.update({
      data: {
        members: {
          connect: { id: userId }
        }
      },
      where: { id: chatId},
    })
  }

  async removeFromChat(chatId: string, userId: number) {
    await this.prisma.chat.update({
      data: {
        members: {
          disconnect: { id: userId }
        }
      },
      where: { id: chatId},
    })
  }

   
  async getPunishments(chatId: string, degree?: PunishmentDegree) {
    return await this.prisma.chatPunishment.findMany({
      where: {
        chatId,
        degree
      }
    })
  }

  async isPunished(chatId: string, userId: number, degree?: PunishmentDegree) {
    return await this.prisma.chatPunishment.count({
      where: {
        chatId,
        degree,
        toUserId: userId
      }
    })
  }

  async removePunishmentByParams(
    chatId: string,
    degree: PunishmentDegree,
    punishedId: number
  ) {
    await this.prisma.chatPunishment.deleteMany({
      where: {
        chatId,
        degree,
        toUserId: punishedId
      },
    });
  }

  async addPunishment(
    chatId: string,
    punisherId: number,
    degree: PunishmentDegree,
    punishedId: number,
    minutes: number
  ) {
    await this.prisma.chatPunishment.create({
      data: {
        chatId,
        fromUserId: punisherId,
        degree,
        toUserId: punishedId,
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

  async isChatAdmin(chatId: string, userId: number): Promise<boolean> {
    const result = await this.prisma.chat.count({
      where: {
        id: chatId,
        admins: {
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
        password: await PasswordService.hash(input.password),
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

  async findAll(whereClause: Prisma.ChatWhereInput, limit?: number, offset?: number) {
    return await this.prisma.chat.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string, include?: string[]) {
    return await this.prisma.chat.findUnique({
      where: { id: id },
      include: {
        admins: include?.includes('admins'),
        members: include?.includes('members'),
        messages: include?.includes('messages'),
        owner: include?.includes('owner')
      }
    });
  }

  async update(updateChatInput: UpdateChatInput) {
    const { id, admins, members, password, ...other } = updateChatInput;
    return await this.prisma.chat.update({
      where: { id },
      data: {
        ...other,
        password: password?.length ? await PasswordService.hash(password) : null,
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
    await this.prisma.chatMessage.deleteMany({ where: { chatId: id} })
    await this.prisma.chatPunishment.deleteMany({ where: { chatId: id} })
    return await this.prisma.chat.delete({ where: { id } });
  }
}
