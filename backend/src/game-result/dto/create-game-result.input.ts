import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateGameResultInput {
  
  @Field(() => [Int])
  players_id: number[];
  
  @Field(() => [Int])
  score: number[]
}
