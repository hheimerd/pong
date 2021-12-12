import { Module } from '@nestjs/common';
import { GameResultService } from './game-result.service';
import { GameResultResolver } from './game-result.resolver';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { UserModule } from 'src/common/user/user.module';

@Module({
  providers: [GameResultResolver, GameResultService],
  imports: [PrismaModule, UserModule],
  exports: [GameResultService]
})
export class GameResultModule {}
