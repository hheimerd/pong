import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Chat } from 'src/chat/entities/chat.entity';
import { Role, User } from 'src/common/user/entities/user.entity';

export type Subjects = InferSubjects<typeof User | typeof Chat> | 'all';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  ReadAll = 'read-all',
  Update = 'update',
  Delete = 'delete',
}

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  static createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      Ability as AbilityClass<AppAbility>,
    );

    if (user.roles.includes(Role.Admin)) {
      can(Action.Manage, User);
      can(Action.Manage, Chat);
    }

    can(Action.Manage, Chat, { ownerId: user.id });

    return build({
      detectSubjectType: (item) =>
        // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
