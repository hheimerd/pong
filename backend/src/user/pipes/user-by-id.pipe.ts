import { Injectable } from '@nestjs/common';
import { ModelByIdPipe } from 'src/pipes/ModelById.pipe';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';

@Injectable()
export class UserByIdPipe extends ModelByIdPipe<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
