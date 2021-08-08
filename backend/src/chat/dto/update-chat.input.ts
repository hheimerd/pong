import { CreateChatInput } from './create-chat.input';
import { InputType, Field, Int, PartialType, PickType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { IsUUID, ValidateIf } from 'class-validator';

@InputType()
export class UpdateChatInput extends PickType(PartialType(CreateChatInput), [
  'name',
  'is_private',
  'password',
]) {
  @Field()
  @IsUUID()
  id: string;
}
