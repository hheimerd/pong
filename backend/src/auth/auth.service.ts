import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { FindConditions, Repository } from 'typeorm';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(login: string, pass: string) {
    const searchOptions: FindConditions<User> = {};

    if (login.includes('@')) {
      searchOptions.email = login;
    } else {
      searchOptions.login = login;
    }
    const user = await this.userService.findOne(searchOptions);

    if (!user) return null;

    const isValid = await compare(pass, user.password);

    if (!isValid) return null;

    const { password, ...userData } = user;
    return userData;
  }

  async login(user: any) {
    const payload = { username: user.name, userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
