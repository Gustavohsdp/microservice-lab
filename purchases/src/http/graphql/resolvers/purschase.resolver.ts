import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user';
import { CustomersService } from 'src/services/customers.service';
import { ProductsService } from 'src/services/products.service';
import { PurchasesService } from 'src/services/purchases.service';
import { CreatePurchaseInput } from '../Inputs/create-purschase-input';
import { Purschase } from '../models/purschase';

@Resolver(() => Purschase)
export class PurchasesResolver {
  constructor(
    private purchasesService: PurchasesService,
    private productsService: ProductsService,
    private customersService: CustomersService,
  ) { }

  @UseGuards(AuthorizationGuard)
  @Query(() => [Purschase])
  purchases() {
    return this.purchasesService.listAllPurchases();
  }

  @ResolveField()
  async product(@Parent() purchase: Purschase) {
    const { productId } = purchase;
    return this.productsService.getProductById(productId);
  }

  @Mutation(() => Purschase)
  @UseGuards(AuthorizationGuard)
  async createPurchase(
    @Args('data') data: CreatePurchaseInput,
    @CurrentUser() user: AuthUser,
  ) {
    const { productId } = data;

    let customer = await this.customersService.getCustomerByAuthUserId(
      user.sub,
    );

    if (!customer.id) {
      customer = await this.customersService.createCustomer({
        authUserId: user.sub,
      });
    }

    return this.purchasesService.createPurchase({
      productId,
      customerId: customer.id,
    });
  }
}
