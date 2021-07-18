import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  Query,
  BadRequestException,
  NotFoundException,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserByIdPipe } from './pipes/user-by-id.pipe';
import { PolicyGuard } from 'src/policy/guards/policy.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(PolicyGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset,
  ) {
    if (limit > 100) throw new BadRequestException();
    return this.userService.findAll(limit, offset);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', UserByIdPipe) user: User) {
    // const user = await this.userService.findById(id);
    // if (user == null) throw new NotFoundException();
    // delete user.password;
    const { password, ...result } = user;
    return result;
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.userService.remove(id);
    if (!result.affected) {
      throw new NotFoundException();
    }
  }
}
