import {
  NotFoundException,
  ValidationPipe,
  UsePipes,
  BadRequestException,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Chat } from 'src/chat/entities/chat.entity';
import { CurrentUser } from 'src/common/auth/decorators/current-user.decorator';
import { Public } from 'src/common/auth/decorators/public.decorator';
import { RequestUser } from 'src/common/auth/entities/request-user.entitiy';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User, { name: 'createUser' })
  @Public()
  @UsePipes(ValidationPipe)
  async create(@Args('input') createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Query(() => User, { name: 'user' })
  async findOneById(
    @Args('id', { type: () => Int }) userId: number,
  ): Promise<User> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Query(() => User)
  async getProfile(@Context('req') req): Promise<User> {
    return this.userService.findOne(req.user.id);
  }

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args('limit', { type: () => Int }, new DefaultValuePipe(15), ParseIntPipe)
    limit,
    @Args('offset', { type: () => Int }, new DefaultValuePipe(0), ParseIntPipe)
    offset,
  ) {
    if (limit > 100) throw new BadRequestException();
    return this.userService.findAll(limit, offset);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UsePipes(ValidationPipe)
  async update(
    @Args('input') dto: UpdateUserDto,
    @CurrentUser() user: RequestUser,
  ) {
    let id = user.id;
    if (dto.id) {
      // TODO: check ablilty
      id = dto.id;
    }
    const updated = await this.userService.update(id, dto);
    if (!updated) throw new NotFoundException();

    return updated;
  }

  @ResolveField(() => [Chat], { name: 'chats' })
  async getChat(@Parent() user: User) {
    return this.userService.getChats(user.id);
  }

  @Mutation(() => Boolean, { name: 'removeUser' })
  async remove(@Args('id', ParseIntPipe) id: number) {
    await this.userService.remove(id);
    return true;
  }
}
