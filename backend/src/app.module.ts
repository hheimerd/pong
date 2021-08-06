import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './common/auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { PolicyModule } from './common/policy/policy.module';
import { ChatMessageModule } from './chat-message/chat-message.module';
import { ChatModule } from './chat/chat.module';
import { StorageModule } from './common/storage/storage.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_PATH } from './common/storage/storage.constants';
import { PrismaModule } from './common/prisma/prisma.module';

const username = process.env.POSTGRES_USER || 'postgres';
const password = process.env.POSTGRES_PASSWORD || 'postgres';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username,
      password,
      database: process.env.DB_NAME || 'pong',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development',
    }),
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_PATH,
      serveRoot: '/public',
    }),
    UserModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'src/schema.gql',
      installSubscriptionHandlers: true,
      cors: {
        origin: '*',
        credentials: true,
      },
    }),
    AuthModule,
    PolicyModule,
    ChatMessageModule,
    ChatModule,
    StorageModule,
    PrismaModule,
  ],
})
export class AppModule {}
