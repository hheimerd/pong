import { Injectable } from '@nestjs/common';
import { CreateChatMessageInput } from './dto/create-chat-message.input';

@Injectable()
export class ChatMessageService {
  create(createChatMessageInput: CreateChatMessageInput) {
    return 'This action adds a new chatMessage';
  }

  findAll() {
    return `This action returns all chatMessage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatMessage`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatMessage`;
  }
}
