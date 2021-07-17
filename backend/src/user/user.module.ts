import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { PolicyModule } from 'src/policy/policy.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserResolver],
  imports: [TypeOrmModule.forFeature([User]), PolicyModule],
  exports: [UserService],
})
export class UserModule {}
