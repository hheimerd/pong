import { ExecutionContext, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { AuthGuard } from '@nestjs/passport';
import { RequestService } from 'src/common/request/request.service';
import { AuthService } from '../auth.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly requestService: RequestService,
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
    ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    
    const req = this.requestService.getRequest(context);
    
    if (!req) {
      const token = context.getArgByIndex(1)?.token;
      if (!token)
        return false;
      try {
        return await this.authService.verifyToken(token);
      } catch (e) {
        console.error(e);
        return false;
      }
    }
    
    return super.canActivate(new ExecutionContextHost([req]));
  }
}
