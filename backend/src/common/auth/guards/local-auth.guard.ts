import { ExecutionContext, Injectable } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { AuthGuard } from '@nestjs/passport';
import { RequestService } from 'src/common/request/request.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly requestService: RequestService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const req = this.requestService.getRequest(context);

    if (context.getType().toString() == 'graphql') {
      req.body = context.getArgByIndex(1);
    }

    console.log(req.body);

    return super.canActivate(new ExecutionContextHost([req]));
  }
}
