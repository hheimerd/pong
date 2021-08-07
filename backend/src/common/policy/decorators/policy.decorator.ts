import { SetMetadata } from '@nestjs/common';
import { Action, Subjects } from '../casl/casl-ablilty.factory';

export const POLICIES_KEY = 'policies';
export const CheckPolicies = (actions: Action, subject: Subjects) =>
  SetMetadata(POLICIES_KEY, { actions, subject });
