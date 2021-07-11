import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

async function bootstrap() {
  try {
    const envConfig = dotenv.parse(fs.readFileSync('.enrhg'));
    console.log(envConfig);
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  } catch (err) {}

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3000);
}
bootstrap();
