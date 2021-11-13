import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { AuthModule } from 'src/common/auth/auth.module';
import { GameResultModule } from 'src/game-result/game-result.module';
import { GameResolver } from './game.resolver';
import { UserModule } from 'src/common/user/user.module';

@Module({
  providers: [GameGateway, GameResolver],
  imports: [AuthModule, GameResultModule, UserModule],
})
export class GameModule {}
