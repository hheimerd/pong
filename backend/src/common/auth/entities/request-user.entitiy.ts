import { ObjectType, PartialType } from '@nestjs/graphql';
import { User } from 'src/common/user/entities/user.entity';

@ObjectType()
export class RequestUser extends PartialType(User) {}
