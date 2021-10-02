import { ObjectType, PartialType } from '@nestjs/graphql';
import { Role, User } from 'src/common/user/entities/user.entity';

@ObjectType()
export class RequestUser extends PartialType(User) {
  constructor(user: User) {
    super();
    for (const field in user) {
      this[field] = user[field];
    }
  }
  
  get isAdmin(): boolean {
    return this.roles.includes(Role.Admin);
  };
}
