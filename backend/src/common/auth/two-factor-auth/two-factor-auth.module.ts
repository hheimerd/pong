import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Module({
  providers: [TwoFactorAuthService],
  imports: [PrismaModule],
  exports: [TwoFactorAuthService]
})
export class TwoFactorAuthModule {}
