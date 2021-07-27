import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number) {
    return this.userModel.findOne(id);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userModel.findOne(id);
    if (!user) return null;
    const updated = { ...user, ...dto};
    
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
}
