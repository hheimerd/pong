import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateChatMessageInput {
  @Field()
  @IsString()
  message: string;

  @Field()
  @IsUUID()
  chat_id: string;
}
