import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { ChatType } from '../entities/chat-type.enum';

@InputType()
export class CreateChatInput {
  @Field({ nullable: true })
  @IsString()
  @MaxLength(32)
  name?: string;
  
  @Field(type => [Int])
  @IsNumber({}, { each: true })
  users: number[];

  @Field(type => ChatType)
  @IsEnum(ChatType)
  type: ChatType;
  
  @Field()
  @IsBoolean()
  is_private: boolean;

  /**
   * // FIXME: Приватный и запароленный это разные чаты? 
   * Мы будем реализовывать приглашение в чат или просто паролем обойдемся? 
   *  */ 
  
  @Field({ nullable: true })
  @MinLength(4)
  password?: string;
}
