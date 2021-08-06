import { Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageResolver } from './chat-message.resolver';
import { ChatModule } from 'src/chat/chat.module';
import { PubSub } from 'graphql-subscriptions';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  providers: [
    ChatMessageResolver,
    ChatMessageService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  imports: [PrismaModule, ChatModule],
  exports: [ChatMessageService, 'PUB_SUB'],
})
export class ChatMessageModule {}
