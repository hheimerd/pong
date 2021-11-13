import { Query, Resolver } from '@nestjs/graphql';
import { GameInfo } from './entities/game-info.entity';
import { GameType } from './entities/game.entity';
import { GameGateway } from './game.gateway';

@Resolver()
export class GameResolver {
  @Query(() => [GameInfo])
  getMatchmakingGames(): GameInfo[]
  {
    return GameGateway.games
      .filter(game => game.gameType == GameType.MM)
      .map(game => game.getInfo());
  }


  @Query(() => [GameInfo])
  getAllGames(): GameInfo[]
  {
    return GameGateway.games
      .filter(game => !game.GameIsFull())
      .map(game => game.getInfo());
  }
}
