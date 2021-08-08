import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateChatMessageInput } from './dto/create-chat-message.input';

@Injectable()
export class ChatMessageService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessageUser(id: string) {
    this.prisma.chatMessage.findUnique({
      where: { id },
      include: { user: true },
    }).user;
  }

  async create(input: CreateChatMessageInput, senderId: number) {
    return this.prisma.chatMessage.create({
      data: {
        message: input.message,
        user: {
          connect: { id: senderId },
        },
        chat: {
          connect: { id: input.chatId },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.chatMessage.findUnique({
      where: { id },
    });
  }
}
