import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { AuthModule } from 'src/common/auth/auth.module';
import { GameResultModule } from 'src/game-result/game-result.module';

@Module({
  providers: [GameGateway],
  imports: [AuthModule, GameResultModule]
})
export class GameModule {}
