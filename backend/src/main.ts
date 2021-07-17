import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

async function bootstrap() {
  try {
    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    console.log(envConfig);
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  } catch (err) {}

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
