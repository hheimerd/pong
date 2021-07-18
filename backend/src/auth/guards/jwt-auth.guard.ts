import { ExecutionContext, Injectable } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { AuthGuard } from '@nestjs/passport';
import { RequestService } from 'src/request/request.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly requestService: RequestService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const req = this.requestService.getRequest(context);

    return super.canActivate(new ExecutionContextHost([req]));
  }
}
