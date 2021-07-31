import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { Chat } from './entities/chat.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    private readonly userService: UserService,
  ) {}

  async create(input: CreateChatInput, user: User) {
    const chat = new Chat();

    chat.admins = Promise.resolve([user]);
    chat.members = Promise.resolve(
      await this.userService.findMany(input.members),
    );
    chat.messages = Promise.resolve([]);
    chat.owner = Promise.resolve(user);
    chat.name = input.name;
    chat.password = input.password;
    chat.is_private = input.is_private;
    chat.type = input.type;

    return this.chatRepository.save(chat);
  }

  findAll(user) {
    return this.chatRepository.find({ where: { user } });
  }

  findOne(id: string) {
    return this.chatRepository.findOne(id);
  }

  update(id: string, updateChatInput: UpdateChatInput) {
    const chat = { id, ...updateChatInput };
    return this.chatRepository.save(chat);
  }

  remove(id: string) {
    return this.chatRepository.delete(id);
  }
}
