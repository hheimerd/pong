import { Module } from '@nestjs/common';
import { GameResultService } from './game-result.service';
import { GameResultResolver } from './game-result.resolver';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  providers: [GameResultResolver, GameResultService],
  imports: [PrismaModule],
  exports: [GameResultService]
})
export class GameResultModule {}
