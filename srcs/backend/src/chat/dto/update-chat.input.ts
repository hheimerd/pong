import { CreateChatInput } from './create-chat.input';
import { InputType, Field, PartialType, OmitType } from '@nestjs/graphql';
import { User } from 'src/common/user/entities/user.entity';
import { IsUUID, ValidateIf } from 'class-validator';

@InputType()
export class UpdateChatInput extends OmitType(PartialType(CreateChatInput), [
  'type'
]) {
  @Field()
  @IsUUID()
  id: string;
}
