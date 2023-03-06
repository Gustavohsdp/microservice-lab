import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Purschase } from './purschase';

@ObjectType('User')
@Directive('@key(fields: "authUserId")')
export class Customer {
  id: string;

  @Field(() => ID)
  authUserId: string;

  @Field(() => [Purschase])
  purschases: Purschase[];
}
