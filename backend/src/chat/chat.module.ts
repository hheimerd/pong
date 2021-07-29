import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { Chat } from './entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyModule } from 'src/policy/policy.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatMessageModule } from 'src/chat-message/chat-message.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), PolicyModule, UserModule, forwardRef(() => ChatMessageModule), AuthModule],
  providers: [ChatResolver, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
