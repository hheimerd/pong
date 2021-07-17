import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserByIdPipe } from './pipes/user-by-id.pipe';

@Resolver()
export class UserResolver {
  @Query(() => User)
  async user(@Args('id', { type: () => Int }, UserByIdPipe) user: User) {
    return user;
  }
}
