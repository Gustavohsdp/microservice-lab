import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { CreateProductInput } from '../Inputs/create-product-input';
import { ProductsService } from './../../../services/products.service';
import { Product } from './../models/product';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) { }

  //Sempre que irei retornar uma estrutura de dados que não é simples, tenho que criar um model.

  @Query(() => [Product])
  products() {
    return this.productsService.listAllProducts();
  }

  @UseGuards(AuthorizationGuard)
  @Mutation(() => Product)
  createProduct(
    @Args('data') data: CreateProductInput
  ) {
    return this.productsService.createProduct(data);
  }
}
