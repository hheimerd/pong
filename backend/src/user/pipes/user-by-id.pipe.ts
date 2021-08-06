import { Injectable } from '@nestjs/common';
import { ModelByIdPipe } from 'src/common/pipes/ModelById.pipe';
import { User } from '@prisma/client';
import { UserService } from '../user.service';

@Injectable()
export class UserByIdPipe extends ModelByIdPipe<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
