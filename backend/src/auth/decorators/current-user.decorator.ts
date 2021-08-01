import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestService } from 'src/request/request.service';
import { RequestUser } from '../entities/request-user.entitiy';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): RequestUser => {
    const req = RequestService.getRequest(context);
    return req.user;
  },
);
