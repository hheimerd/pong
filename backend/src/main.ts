import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

async function bootstrap() {
  try {
    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  } catch (err) {}

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
