import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { genSalt, hash } from 'bcryptjs';
import { StorageService } from 'src/common/storage/storage.service';
import * as sharp from 'sharp';
import { join } from 'path';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { Chat } from '@prisma/client';

@Injectable()
export class UserService {
  async getFollowing(id: number) {
    return await this.prisma.user.findMany({
      where: {
        following: { some: { id: id } },
      },
    });
  }

  async getFollowers(id: number) {
    return await this.prisma.user.findMany({
      where: {
        followedBy: { some: { id: id } },
      },
    });
  }
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {
    prisma.applySoftDelete('User', 'deleted_at', new Date(), null);
  }

  async getFriends(id: number) {
    return await this.prisma.user.findMany({
      where: {
        following: { some: { id: id } },
        followedBy: { some: { id: id } },
      },
    });
  }

  async followToUser(id: number, friendId: number) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        following: {
          connect: { id: friendId },
        },
      },
    });
  }

  async unfollowUser(id: number, friendId: number) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        following: {
          disconnect: { id: friendId },
        },
      },
    });
  }

  async getChats(userId: number): Promise<Chat[]> {
    return this.prisma.chat.findMany({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
    });
  }

  async restore(id: number) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        deleted_at: null,
      },
    });
  }

  async uploadAvatar(
    image: Express.Multer.File,
    userId: number,
  ): Promise<string[]> {
    const user = await this.findOne(userId);

    const sharpLarge = sharp(image.buffer).resize(512).toFormat('webp');
    const sharpIco = sharpLarge.clone().resize(64, 64);

    const uploadPath = join('avatars', user.id.toString(), 'avatar');

    const put = this.storageService.put.bind(this.storageService);
    const paths = await Promise.all([
      put(await sharpIco.toBuffer(), uploadPath + '_ico' + '.webp'),
      put(await sharpLarge.toBuffer(), uploadPath + '.webp'),
    ]);

    const oldAvatar = user.avatar;

    user.avatar = paths;
    await this.prisma.user.create({ data: user });

    this.storageService.delete(...oldAvatar);

    return user.avatar;
  }

  async create(createUserDto: CreateUserDto) {
    const exists = await this.count({
      email: createUserDto.email,
      login: createUserDto.login,
    });

    if (exists != 0) throw new ConflictException();

    const salt = await genSalt(10);
    const password = await hash(createUserDto.password, salt);
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password },
    });
    return user;
  }

  async findAll(take = 15, skip = 0, whereClause?: Prisma.UserWhereInput) {
    return this.prisma.user.findMany({ take, skip, where: whereClause });
  }

  async findMany(ids: number[]) {
    return this.prisma.user.findMany({ where: { id: { in: ids } } });
  }

  async findOne(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data: data });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async find(search) {
    return this.prisma.user.findUnique({
      where: search,
    });
  }

  async count(options) {
    return this.prisma.user.count({ where: options });
  }

  async findOrCreate(dto: CreateUserDto) {
    const user: User = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (user) {
      return user;
    }

    return await this.create(dto);
  }
}
