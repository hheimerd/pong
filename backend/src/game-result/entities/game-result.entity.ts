import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class GameResult {
   @Field()
  id: string;
  
  @Field(() => [Int])
  players_id: number[];
  
  @Field(() => [Int])
  score: number[]
  
  @Field()
  created_at: Date;
}
