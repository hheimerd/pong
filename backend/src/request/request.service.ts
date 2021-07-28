import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export class RequestService {
  getRequest(context: ExecutionContext) {
    if (context.getType().toString() === 'graphql') {
      const { req } = GqlExecutionContext.create(context).getContext();
      return req;
    } else {
      return context.switchToHttp().getRequest();
    }
  }

  static getRequest(context: ExecutionContext) {
    if (context.getType().toString() === 'graphql') {
      const { req } = GqlExecutionContext.create(context).getContext();
      return req;
    } else {
      return context.switchToHttp().getRequest();
    }
  }
}
