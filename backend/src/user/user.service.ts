import { ConflictException, Injectable } from '@nestjs/common';
import { FindConditions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { genSalt, hash } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageService } from 'src/storage/storage.service';
import * as sharp from 'sharp';
import { join } from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userModel: Repository<User>,
    private readonly storageService: StorageService,
  ) {}

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
    await this.userModel.save(user);

    this.storageService.delete(...oldAvatar);

    return user.avatar;
  }

  async create(createUserDto: CreateUserDto) {
    const exists = await this.count([
      { email: createUserDto.email },
      { login: createUserDto.login },
    ]);

    if (exists != 0) throw new ConflictException();

    const salt = await genSalt(10);
    const password = await hash(createUserDto.password, salt);
    const user = await this.userModel.create({ ...createUserDto, password });
    await this.userModel.save(user);
    return user;
  }

  async findAll(take = 15, skip = 0) {
    return this.userModel.find({ take, skip });
  }

  async findMany(ids: number[]) {
    return this.userModel.findByIds(ids);
  }

  async findOne(id: number) {
    return this.userModel.findOne(id);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userModel.findOne(id);
    if (!user) return null;
    const updated = { ...user, ...dto };

    return this.userModel.save(updated);
  }

  async remove(id: number) {
    return this.userModel.delete(id);
  }

  async find(search) {
    return this.userModel.findOne({
      where: search,
    });
  }

  async count(options: FindConditions<User>[]) {
    return this.userModel.count({ where: options });
  }

  async findOrCreate(dto: CreateUserDto) {
    const user: User = await this.userModel.findOne({
      where: { email: dto.email },
    });
    if (user) {
      return user;
    }

    return await this.create(dto);
  }
}
