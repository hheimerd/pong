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
  @Field({ nullable: true, description: 'ADMIN ONLY' })
  id?: number;

  @IsString()
  @MinLength(6)
  @IsOptional()
  @Field({ nullable: true })
  newPassword?: string;

  @IsString()
  @MinLength(6)
  @ValidateIf((o) => !o.id && (o.password || o.email))
  @Field({
    nullable: true,
    description: 'required if change email or password',
  })
  oldPassword?: string;
}
