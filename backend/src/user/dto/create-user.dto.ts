import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 32)
  name?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @Length(6, 32)
  login?: string;

  @IsString()
  @MinLength(6)
  password?: string;
}
