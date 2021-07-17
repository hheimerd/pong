import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestService } from 'src/request/services/request.service';
import { CaslAbilityFactory } from '../casl/casl-ablilty.factory';

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private readonly requestService: RequestService,
    private readonly caslFactory: CaslAbilityFactory,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = this.requestService.getRequest(context);

    return null === request;
  }
}
