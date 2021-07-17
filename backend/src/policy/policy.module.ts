import { Module } from '@nestjs/common';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [CaslModule],
  exports: [CaslModule],
})
export class PolicyModule {}
