import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { PolicyModule } from 'src/common/policy/policy.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/common/auth/auth.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PolicyModule, UserModule, AuthModule, PrismaModule],
  providers: [ChatResolver, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
