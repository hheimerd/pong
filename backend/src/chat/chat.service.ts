import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RequestUser } from 'src/common/auth/entities/request-user.entitiy';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

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
    return this.prisma.chat.create({
      data: {
        name: input.name,
        password: input.password,
        is_private: input.is_private,
        type: input.type,
        admins: {
          connect: { id: ownerId },
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

  findAll(user: RequestUser) {
    return this.prisma.user.findUnique({ where: { id: user.id } }).chats;
  }

  findOne(id: string) {
    return this.prisma.chat.findUnique({ where: { id: id } });
  }

  update(id: string, updateChatInput: UpdateChatInput) {
    return this.prisma.chat.update({
      where: { id },
      data: {
        ...updateChatInput,
      },
    });
  }

  remove(id: string) {
    return this.prisma.chat.delete({ where: { id } });
  }
}
