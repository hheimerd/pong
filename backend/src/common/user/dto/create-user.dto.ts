import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';

@InputType()
export class CreateUserDto {
  @IsString()
  @Length(1, 32)
  @Field()
  name: string;

  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @Length(6, 32)
  @Field()
  login: string;

  @IsString()
  @MinLength(6)
  @Field()
  password: string;
}
