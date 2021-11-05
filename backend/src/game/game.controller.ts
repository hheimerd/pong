import { Controller, Get } from '@nestjs/common';
import { GameType } from './entities/game.entity';
import { GameGateway } from './game.gateway';

@Controller('game')
export class GameController {
  @Get('matchmaking')
  getMatchmakingGames()
  {
    return GameGateway.games
      .filter(game => game.gameType == GameType.MM)
      .map(game => game.getInfo());
  }


  @Get('all')
  getAllGames()
  {
    return GameGateway.games.map(game => game.getInfo());
  }
}
