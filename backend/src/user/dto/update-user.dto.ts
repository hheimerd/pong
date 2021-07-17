import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // @IsString()
  // @Length(1, 32)
  // @IsOptional()
  // name?: string;

  // @IsEmail()
  // @IsOptional()
  // email?: string;

  // @IsString()
  // @Length(6, 32)
  // @IsOptional()
  // login?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  newPassword?: string;

  @IsString()
  @MinLength(6)
  @ValidateIf((o) => o.password || o.email)
  oldPassword?: string;
}
