import { Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageResolver } from './chat-message.resolver';
import { ChatMessage } from './entities/chat-message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ChatModule } from 'src/chat/chat.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [
    ChatMessageResolver, 
    ChatMessageService, 
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    }
  ],
  imports: [TypeOrmModule.forFeature([ChatMessage]), ChatModule],
  exports: [ChatMessageService, 'PUB_SUB'],
})
export class ChatMessageModule {}
