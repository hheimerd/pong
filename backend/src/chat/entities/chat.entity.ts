import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { ChatMessage } from 'src/chat-message/entities/chat-message.entity';
import { User } from 'src/user/entities/user.entity';
import { ChatType } from '@prisma/client';

registerEnumType(ChatType, { name: 'ChatType' });

@ObjectType()
export class Chat {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field((type) => [User])
  members: Promise<User[]>;

  @Field((type) => [User], { nullable: true })
  admins?: Promise<User[]>;

  @Field((type) => User, { nullable: true })
  owner?: Promise<User>;

  @Field((type) => ChatType)
  type: ChatType;

  @Field()
  is_private: boolean;

  @Field((type) => [ChatMessage])
  messages: Promise<ChatMessage[]>;
}
