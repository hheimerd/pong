import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PunishmentDegree } from "./chat.entity";

@ObjectType()
export class ChatPunishment {
  
  @Field()
  chatId: string;
  
  @Field(() => Int)
  fromUserId: number;
  
  @Field(() => Int)
  toUserId: number;
  
  @Field()
  degree: PunishmentDegree;
  
  @Field()
  created_at: Date;
  
  @Field(() => Int)
  minutes: number;
}