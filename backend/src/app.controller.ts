/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Res } from '@nestjs/common';
import {
  generateImage,
  generateRandomBgImage2,
  generateRandomBgImage,
  generateSvgGradient,
} from './common/helpers/image-generator.lib';
import { Response } from 'express';
import sharp from 'sharp';
import { Public } from './common/auth/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('/test')
  async test(@Res() res: Response) {
    // const image = generateRandomBgImage(100, 100, 'Z', 'png');
    // const image = generateRandomBgImage2(100, 100);
    const image = generateRandomBgImage2(100, 100, 'png');

    image.pipe(res);
  }
}
