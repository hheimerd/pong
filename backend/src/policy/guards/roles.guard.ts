import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestService } from 'src/request/request.service';
import { Role } from 'src/user/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly requestService: RequestService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const reqiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!reqiredRoles) return true;

    const { user } = this.requestService.getRequest(context);
    return reqiredRoles.some((role) => user.roles?.includes(role));
  }
}
