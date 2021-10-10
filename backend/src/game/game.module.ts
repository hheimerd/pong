import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { AuthModule } from 'src/common/auth/auth.module';

@Module({
  providers: [GameGateway],
  imports: [AuthModule]
})
export class GameModule {}
