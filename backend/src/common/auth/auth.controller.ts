import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Response } from 'express';
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
  async login42(@Request() req, @Res() res: Response) {
    const payload = plainToClass(RequestUser, req.user);
    const token = (await this.authService.login(payload)).access_token;
    res.redirect('http://localhost/?token=' + token);
  }
}
