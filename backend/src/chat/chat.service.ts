import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RequestUser } from 'src/common/auth/entities/request-user.entitiy';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

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
          connect: [
            {
              id: input.members[0],
            },
          ],
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
