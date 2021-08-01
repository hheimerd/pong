import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { PolicyModule } from 'src/policy/policy.module';
import { ModelByIdPipe } from 'src/pipes/ModelById.pipe';
import { StorageModule } from 'src/storage/storage.module';

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
  imports: [TypeOrmModule.forFeature([User]), PolicyModule, StorageModule],
  exports: [UserService],
})
export class UserModule {}
