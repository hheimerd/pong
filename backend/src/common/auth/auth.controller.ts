import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { RequestUser } from './entities/request-user.entitiy';
import { FtAuthGuard } from './guards/ft-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(FtAuthGuard)
  @Public()
  @Get('login42')
  async login42(@Request() req) {
    const payload = plainToClass(RequestUser, req.user);
    return this.authService.login(payload);
  }
}
