import { NotFoundException, ValidationPipe, UseGuards, UsePipes, BadRequestException, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserByIdPipe } from './pipes/user-by-id.pipe';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: 'createUser' })
  @UsePipes(ValidationPipe)
  async create(@Args('input') createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User, { name: 'user' })
  async findOneById(@Args('id', { type: () => Int }, UserByIdPipe) user: User) {
    if (!user) throw new NotFoundException();
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args('limit', { type: () => Int }, new DefaultValuePipe(15), ParseIntPipe) limit,
    @Args('offset', { type: () => Int }, new DefaultValuePipe(0), ParseIntPipe) offset,
  ) {
    if (limit > 100) throw new BadRequestException();
    return this.userService.findAll(limit, offset);
  }


  @UseGuards(JwtAuthGuard)
  @Mutation(() => User, { name: 'updateUser' })
  @UsePipes(ValidationPipe)
  async update(
    @Args('id', ParseIntPipe) id: number,
    @Args('input') updateUserDto: UpdateUserDto,
  ) {
    // console.log(id, updateUserDto);
    const updated = await this.userService.update(id, updateUserDto);
    if (!updated) throw new NotFoundException();
    
    return updated
  }

  @Mutation(() => Boolean, { name: 'removeUser' })
  async remove(@Args('id', ParseIntPipe) id: number) {
    const result = await this.userService.remove(id);
    if (!result.affected) {
      throw new NotFoundException();
    }
    return true;
  }
}
