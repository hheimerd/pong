import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { PolicyModule } from 'src/common/policy/policy.module';
import { StorageModule } from 'src/common/storage/storage.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserResolver],
  imports: [PolicyModule, StorageModule, PrismaModule],
  exports: [UserService],
})
export class UserModule {}
