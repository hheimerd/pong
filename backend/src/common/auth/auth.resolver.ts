import { UseGuards, Request, Req, UnauthorizedException } from '@nestjs/common';
import {
  Args,
  Context,
  Field,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { RequestUser } from './entities/request-user.entitiy';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@ObjectType()
class JwtResponse {
  @Field({ nullable: true})
  access_token?: string;

  @Field({ nullable: true})
  message?: string;
}

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFAService: TwoFactorAuthService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Query(() => JwtResponse)
  async login(
    @Args('login') login: string,
    @Args('password') password: string,
    @Context('req') req: Request & { user: RequestUser },
  ): Promise<JwtResponse> {
    const user = req.user;
    if (user.TwoFactorAuth) {
      this.twoFAService.sendCode(user.id);
      return {
        message: "We send auth link to your email: " + user.email,
      };
    }
    return this.authService.login(user);
  }

  @Public()
  @Query(() => JwtResponse)
  async verify2fa(
    @Args("code") code: string,
    @Args("auth_id") id: string,
  ) {
    const user = this.twoFAService.validate(code, id);
    if (!user) throw new UnauthorizedException("Incorrect code. Try login again");

    return this.authService.login(user);
  }
}
