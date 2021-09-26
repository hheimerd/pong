import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { SMTPServer } from 'smtp-server';

export class SocketAdapter extends IoAdapter {
  createIOServer(
    port: number,
    options?: ServerOptions & {
      namespace?: string;
      server?: any;
    },
  ) {
    const server = super.createIOServer(port, { ...options, cors: true });
    return server;
  }
}

async function createSmtp() {
  const server = new SMTPServer({
  });
  server.listen(25);
}

async function bootstrap() {
  try {
    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  } catch (err) { }

  createSmtp();

  const app = await NestFactory.create(AppModule, { cors: true });
  app.useWebSocketAdapter(new SocketAdapter(app)); app.enableCors();
  app.use(cors({
    origin: '*'
  }))
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
