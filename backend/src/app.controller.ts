/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, OnApplicationBootstrap, Res } from '@nestjs/common';
import {
  generateImage,
  generateRandomBgImage,
  generateSvgGradient,
} from './common/helpers/image-generator.lib';
import { PrismaService } from './common/prisma/prisma.service';
import { env } from 'process';
import { Role } from './common/user/entities/user.entity';
import { UserService } from './common/user/user.service';

@Controller()
export class AppController implements OnApplicationBootstrap {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  async onApplicationBootstrap() {
    const userExists = await this.prisma.user.findUnique({
      where: { login: 'administrator' },
    });

    if (userExists) return;

    const admin = await this.userService.create(
      {
        email: 'info@' + env.HOST,
        login: 'administrator',
        password: env.ADMIN_PASS,
        name: 'administrator',
      },
      [Role.Admin],
    );
  }
}
