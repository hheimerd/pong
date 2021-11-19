import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import bcryptjs from 'bcryptjs';
const { genSalt, hash } = bcryptjs;
import { StorageService } from 'src/common/storage/storage.service';
import sharp from 'sharp';
import { join } from 'path';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { Chat } from '@prisma/client';
import { generateRandomBgImage2 } from 'src/common/helpers/image-generator.lib';
import { Role } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {
    prisma.applySoftDelete('User', 'deleted_at', new Date(), null);
  }

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

  async uploadAvatar(image: Buffer, userId: number): Promise<string[]> {
    const user = await this.findOne(userId);

    const sharpLarge = sharp(image).resize(512).png({ progressive: true });
    const sharpIco = sharpLarge.clone().resize(64, 64);

    const uploadPath = join('avatars', user.id.toString(), 'avatar');

    const put = this.storageService.put.bind(this.storageService);
    const paths = await Promise.all([
      put(await sharpIco.toBuffer(), uploadPath + '_ico' + '.png'),
      put(await sharpLarge.toBuffer(), uploadPath + '.png'),
    ]);

    const oldAvatar = user.avatar;

    user.avatar = paths;
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatar: paths,
      },
    });

    this.storageService.delete(...oldAvatar);

    return user.avatar;
  }

  async create(dto: CreateUserDto, roles: Role[] = [Role.User]) {
    const exists = await this.count({
      email: dto.email,
      login: dto.login,
    });

    if (exists != 0) throw new ConflictException();

    const salt = await genSalt(10);
    const password = await hash(dto.password, salt);
    const user = await this.prisma.user.create({
      data: { ...dto, password, roles },
    });
    const avatar = generateRandomBgImage2(512, 512, 'png');
    this.uploadAvatar(await avatar.toBuffer(), user.id);
    return user;
  }

  async findAll(take = 15, skip = 0, whereClause?: Prisma.UserWhereInput, orderBy?: Prisma.UserOrderByInput) {
    return this.prisma.user.findMany({ take, skip, where: whereClause, orderBy });
  }

  async findMany(ids: number[]) {
    return this.prisma.user.findMany({ where: { id: { in: ids } } });
  }

  async findOne(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
      return await this.prisma.user.update({ where: { id }, data: data });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }


  async exists(search: Prisma.UserWhereInput): Promise<boolean> {
    return !! await this.prisma.user.findFirst({
      where: search,
    });
  }

  async find(search: Prisma.UserWhereUniqueInput) {
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
