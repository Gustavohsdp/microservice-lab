import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Product } from './product';

enum PurschaseStatus {
  PENDING = 'PENDING',
  APROVED = 'APROVED',
  FAILED = 'FAILED',
}

registerEnumType(PurschaseStatus, {
  name: 'PurschaseStatus',
  description: 'Avaiable purschase status'
})

@ObjectType()
export class Purschase {
  @Field(() => ID)
  id: string;

  @Field(() => PurschaseStatus)
  status: PurschaseStatus;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Product)
  product: Product;

  productId: string;
}
