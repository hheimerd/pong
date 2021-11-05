import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { AuthModule } from 'src/common/auth/auth.module';
import { GameResultModule } from 'src/game-result/game-result.module';
import { GameController } from './game.controller';

@Module({
  providers: [GameGateway],
  imports: [AuthModule, GameResultModule],
  controllers: [GameController]
})
export class GameModule {}
