import {
  NotFoundException,
  ValidationPipe,
  UsePipes,
  BadRequestException,
  DefaultValuePipe,
  ParseIntPipe,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
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
import { Prisma } from '@prisma/client';
import { Chat } from 'src/chat/entities/chat.entity';
import { CurrentUser } from 'src/common/auth/decorators/current-user.decorator';
import { Public } from 'src/common/auth/decorators/public.decorator';
import { RequestUser } from 'src/common/auth/entities/request-user.entitiy';
import { GameGateway } from 'src/game/game.gateway';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User, { name: 'createUser' })
  @Public()
  @UsePipes(ValidationPipe)
  async create(@Args('input') createUserDto: CreateUserDto) {
    const userExists = await this.userService.exists({email: createUserDto.email, login: createUserDto.login})
    if (userExists)
      throw new ConflictException();
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
  async getProfile(@CurrentUser() currentUser: RequestUser): Promise<User> {
    const user = await this.userService.findOne(currentUser?.id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args('limit', { type: () => Int, nullable: true })
    limit = 15,
    @Args('offset', { type: () => Int, nullable: true })
    offset = 0,
    @Args('withDeleted', { nullable: true }) withDeleted: false,
  ) {
    if (limit > 100) throw new BadRequestException();

    let query: Prisma.UserWhereInput;
    if (withDeleted) {
      query = {
        deleted_at: {},
      };
    }
    return this.userService.findAll(limit, offset, query);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UsePipes(ValidationPipe)
  async update(
    @Args('input') dto: UpdateUserDto,
    @CurrentUser() user: RequestUser,
  ) {
    let id = user.id;

    if (dto.id || dto.roles) {
      const isAdmin = user.roles.includes(Role.Admin);
      if (!isAdmin) throw new UnauthorizedException();
      
      if (dto.id) id = dto.id;
    }

    const updated = await this.userService.update(id, dto);
    if (!updated) throw new NotFoundException();

    return updated;
  }

  @ResolveField(() => [Chat], { name: 'chats' })
  async getChat(@Parent() user: User) {
    return this.userService.getChats(user.id);
  }

  @ResolveField(() => Int, { name: 'gameId' })
  async getGameId(@Parent() user: User) {
    return GameGateway.games.filter(g => g.PlayerInGame(user.id))[0] ?? 0;
  }


  @ResolveField(() => [User], { name: 'friends' })
  async getFriends(@Parent() user: User) {
    return this.userService.getFriends(user.id);
  }

  @ResolveField(() => [User], { name: 'followers' })
  async getFollowers(@Parent() user: User) {
    return await this.userService.getFollowers(user.id);
  }

  @ResolveField(() => [User], { name: 'following' })
  async getFollowing(@Parent() user: User) {
    return this.userService.getFollowing(user.id);
  }

  @Mutation(() => Boolean, { name: 'followToUser' })
  async followToUser(
    @Args('userId', { type: () => Int }) userId: number,
    @CurrentUser() user: RequestUser,
  ) {
    if (user.id === userId) throw new ConflictException();
    const updated = await this.userService.followToUser(userId, user.id);
    if (!updated) throw new NotFoundException();
    return true;
  }

  @Mutation(() => Boolean, { name: 'unfollowUser' })
  async unfollowUser(
    @Args('userId', { type: () => Int }) userId: number,
    @CurrentUser() user: RequestUser,
  ) {
    if (user.id === userId) throw new ConflictException();
    const updated = await this.userService.unfollowUser(userId, user.id);
    if (!updated) throw new NotFoundException();
    return true;
  }

  @Mutation(() => Boolean, { name: 'removeUser' })
  async remove(
    @Args('id', ParseIntPipe) id: number, 
    @CurrentUser() currentUser: RequestUser
    ) {
    const user = await this.userService.findOne(id);
    
    if (!user) throw new NotFoundException();

    if (currentUser.id != user.id && !currentUser.isAdmin)
      throw new ForbiddenException();

    await this.userService.remove(id);
    return true;
  }

  @Mutation(() => Boolean, { name: 'restoreUser' })
  async restore(
    @Args('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: RequestUser
    ) {
    if (!currentUser.isAdmin)
      throw new ForbiddenException();
    
    const user = await this.userService.restore(id);
    if (!user) throw new NotFoundException();

    return true;
  }
}
