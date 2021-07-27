import { CreateChatInput } from './create-chat.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { OmitType, PickType } from '@nestjs/mapped-types';
import { User } from 'src/user/entities/user.entity';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateChatInput
  extends PickType(PartialType(CreateChatInput), ['name', 'is_private', 'password']
  ) {
  @Field()
  @IsUUID()
  id: string;
}
