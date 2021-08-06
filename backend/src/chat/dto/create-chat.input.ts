import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ChatType } from '@prisma/client';

@InputType()
export class CreateChatInput {
  @Field({ nullable: true })
  @IsString()
  @MaxLength(32)
  name?: string;

  @Field((type) => [Int])
  @IsNumber({}, { each: true })
  members: number[];

  @Field((type) => ChatType)
  @IsEnum(ChatType)
  type: ChatType;

  @Field()
  @IsBoolean()
  is_private: boolean;

  @Field({ nullable: true })
  @MinLength(4)
  password?: string;
}
