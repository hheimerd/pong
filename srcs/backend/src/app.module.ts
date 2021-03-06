import { Module } from '@nestjs/common';
import { UserModule } from './common/user/user.module';
import { AuthModule } from './common/auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { PolicyModule } from './common/policy/policy.module';
import { ChatMessageModule } from './chat-message/chat-message.module';
import { ChatModule } from './chat/chat.module';
import { StorageModule } from './common/storage/storage.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_PATH } from './common/storage/storage.constants';
import { PrismaModule } from './common/prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { GameModule } from './game/game.module';
import { AppGateway } from './app.gateway';
import { GameResultModule } from './game-result/game-result.module';

@Module({
  imports: [
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
    ScheduleModule.forRoot(),
    AuthModule,
    PolicyModule,
    ChatMessageModule,
    ChatModule,
    StorageModule,
    PrismaModule,
    GameModule,
    GameResultModule,
  ],
  controllers: [AppController],
  providers: [AppGateway],
})
export class AppModule {}
