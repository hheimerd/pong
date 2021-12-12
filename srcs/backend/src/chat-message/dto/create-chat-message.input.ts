import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateChatMessageInput {
  @Field()
  @IsString()
  message: string;

  @Field()
  @IsUUID()
  chatId: string;
}
