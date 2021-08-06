import { IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
