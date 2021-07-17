import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ablilty.factory';

@Module({
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
