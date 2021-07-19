import { Field, InputType } from '@nestjs/graphql';
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

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @Length(1, 32)
  @IsOptional()
  @Field({ nullable: true })
  name?: string;

  @IsEmail()
  @IsOptional()
  @Field({ nullable: true })
  email?: string;

  @IsString()
  @Length(6, 32)
  @IsOptional()
  @Field({ nullable: true })
  login?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  @Field({ nullable: true })
  newPassword?: string;

  @IsString()
  @MinLength(6)
  @ValidateIf((o) => o.password || o.email)
  @Field({ nullable: true })
  oldPassword?: string;
}
