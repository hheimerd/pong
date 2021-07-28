import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatService } from 'src/chat/chat.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateChatMessageInput } from './dto/create-chat-message.input';
import { ChatMessage } from './entities/chat-message.entity';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessage) private readonly messageRepository: Repository<ChatMessage>,
    private readonly chatService: ChatService
    ) {}

  @UsePipes(ValidationPipe)
  create(input: CreateChatMessageInput, user: User) {
    const message = new ChatMessage();
    message.chat = this.chatService.findOne(input.chat);
    message.message = input.message;
    message.user = Promise.resolve(user);
    return this.messageRepository.save(message);
  }

  findOne(id: number) {
    return this.messageRepository.findOne(id);
  }
}
