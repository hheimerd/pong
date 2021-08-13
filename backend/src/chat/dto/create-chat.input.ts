import { InputType, Int, Field } from '@nestjs/graphql';
import {
  ArrayMinSize,
  ArrayUnique,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ChatType } from '../entities/chat.entity';

@InputType()
export class CreateChatInput {
  @Field({ nullable: true })
  @IsString()
  @ValidateIf((o) => o.type == ChatType.Channel)
  @MaxLength(32)
  name?: string;

  @Field((type) => [Int])
  @IsNumber({}, { each: true })
  @ArrayUnique()
  @ArrayMinSize(2)
  members: number[];

  @Field((type) => ChatType)
  @IsEnum(ChatType)
  type: ChatType;

  @Field()
  @IsBoolean()
  is_private: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(4)
  password?: string;
}
