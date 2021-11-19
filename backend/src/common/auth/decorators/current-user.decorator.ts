import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestService } from 'src/common/request/request.service';
import { RequestUser } from '../entities/request-user.entitiy';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): RequestUser => {
    const req = RequestService.getRequest(context);
    return new RequestUser(req.user);
  },
);
