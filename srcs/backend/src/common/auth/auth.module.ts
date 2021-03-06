import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RequestModule } from 'src/common/request/request.module';
import { UserModule } from 'src/common/user/user.module';
import { jwtConstants } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthResolver } from './auth.resolver';
import { FtStrategy } from './strategies/ft.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from 'src/common/user/user.service';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AuthResolver,
    FtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1w' },
    }),
    RequestModule,
    TwoFactorAuthModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
