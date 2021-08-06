import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RequestService } from 'src/common/request/request.service';
import { CaslAbilityFactory } from '../casl/casl-ablilty.factory';
import { POLICIES_KEY } from '../decorators/policy.decorator';

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly requestService: RequestService,
    private readonly caslFactory: CaslAbilityFactory,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const meta = this.reflector.getAllAndOverride(POLICIES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!meta) return true;

    const { user } = this.requestService.getRequest(context);
    if (!user) throw new UnauthorizedException();

    const ablilty = this.caslFactory.createForUser(user);

    return meta.actions.every((action) => ablilty.can(action, meta.subject));
  }
}
