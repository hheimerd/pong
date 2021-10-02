import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GameResultService } from './game-result.service';
import { GameResult } from './entities/game-result.entity';
import { CreateGameResultInput } from './dto/create-game-result.input';

@Resolver(() => GameResult)
export class GameResultResolver {
  constructor(private readonly gameResultService: GameResultService) {}

  @Query(() => [GameResult], { name: 'gameResult' })
  findAll(
    @Args('user_id',{ type: () => Int }) userId: number,
    @Args('take',{ type: () => Int, nullable: true }) take = 15,
    @Args('skip',{ type: () => Int, nullable: true }) skip = 0,
  ) {
    return this.gameResultService.findAll(userId, take, skip);
  }
}
