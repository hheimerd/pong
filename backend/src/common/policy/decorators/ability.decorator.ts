import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { RequestService } from 'src/common/request/request.service';
import {
  CaslAbilityFactory,
  Subjects,
  Action,
} from '../casl/casl-ability.factory';

export const Ability = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = RequestService.getRequest(ctx);

    const caslAbility = await CaslAbilityFactory.createForUser(request.user);
    const ability = {
      ...caslAbility,
      throwUnlessCan(action: Action, subject: Subjects, field?: string) {
        if (!subject) throw new NotFoundException();
        if (caslAbility.cannot(action, subject, field))
          throw new ForbiddenException();
      },
    };
    return ability;
  },
);
