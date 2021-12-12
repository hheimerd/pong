import { Module } from '@nestjs/common';
import { RequestModule } from 'src/common/request/request.module';
import { CaslModule } from './casl/casl.module';
import { PolicyGuard } from './guards/policy.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  providers: [PolicyGuard, RolesGuard],
  imports: [CaslModule, RequestModule],
  exports: [CaslModule, RequestModule],
})
export class PolicyModule {}
