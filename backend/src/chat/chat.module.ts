import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { Chat } from './entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyModule } from 'src/policy/policy.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), PolicyModule, UserModule, ChatModule],
  providers: [ChatResolver, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
