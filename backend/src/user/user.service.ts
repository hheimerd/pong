import { ConflictException, Injectable } from '@nestjs/common';
import { FindConditions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { genSalt, hash } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userModel: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const exists = await this.count({
      email: createUserDto.email,
      login: createUserDto.login,
    });

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

  async findById(id: number) {
    return this.userModel.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.update(id, updateUserDto);
  }

  async remove(id: number) {
    return this.userModel.delete(id);
  }

  async findOne(search) {
    return this.userModel.findOne({
      where: search,
    });
  }

  async count(options: FindConditions<User>) {
    return this.userModel.count({ where: options });
  }
}
