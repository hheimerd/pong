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
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PolicyGuard } from 'src/common/policy/guards/policy.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/auth/decorators/current-user.decorator';
import { RequestUser } from 'src/common/auth/entities/request-user.entitiy';

@Controller('user')
@UseGuards(PolicyGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(ValidationPipe)
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

  @Get(':id')
  async findOne(@Param('id') id) {
    const { password, ...result } = await this.userService.findOne(id);
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
    await this.userService.remove(id);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('image'))
  async updateAvatar(
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser() user: RequestUser,
  ) {
    const mime = image.mimetype;
    if (!mime.startsWith('image/')) {
      throw new BadRequestException();
    }
    return await this.userService.uploadAvatar(image.buffer, user.id);
  }
}
