import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { PolicyModule } from 'src/common/policy/policy.module';
import { ModelByIdPipe } from 'src/common/pipes/ModelById.pipe';
import { StorageModule } from 'src/common/storage/storage.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserResolver,
    {
      provide: ModelByIdPipe,
      useFactory: (userService: UserService) => {
        class Special extends ModelByIdPipe {}
        return new Special(userService);
      },
    },
  ],
  imports: [PolicyModule, StorageModule, PrismaModule],
  exports: [UserService],
})
export class UserModule {}
