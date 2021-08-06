import { UseGuards, Request, Req } from '@nestjs/common';
import {
  Args,
  Context,
  Field,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { RequestUser } from './entities/request-user.entitiy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ObjectType()
class JwtResponse {
  @Field()
  access_token: string;
}

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Query(() => JwtResponse)
  async login(
    @Args('login') login: string,
    @Args('password') password: string,
    @Context('req') req,
  ) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => RequestUser)
  async getProfile(@Context('req') req): Promise<RequestUser> {
    return this.userService.findOne(req.user.id);
  }
}
