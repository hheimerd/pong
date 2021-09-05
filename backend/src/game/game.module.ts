import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { AuthModule } from 'src/common/auth/auth.module';

@Module({
  providers: [GameGateway, GameService],
  imports: [AuthModule]
})
export class GameModule {}
