import { Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageResolver } from './chat-message.resolver';
import { ChatMessage } from './entities/chat-message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ChatMessageResolver, ChatMessageService],
  imports: [TypeOrmModule.forFeature([ChatMessage])]
})
export class ChatMessageModule {}
