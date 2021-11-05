import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GameInfo {
  @Field(() => String)
  id: string;

  @Field(() => [Int])
  players: number[];

  @Field(() => String)
  name: string;
}
