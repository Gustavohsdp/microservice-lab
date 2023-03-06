import { Injectable } from '@nestjs/common';
import { KafkaService } from 'src/messaging/kafka.service';
import { PrismaService } from './../database/prisma/prisma.service';

type createPurschaseParams = {
  productId: string;
  customerId: string;
};

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService, private kafka: KafkaService) { }

  listAllPurchases() {
    return this.prisma.purchase.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async listAllFromCustomer(customerId: string) {
    const purschasesByCustomer = await this.prisma.purchase.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return purschasesByCustomer;
  }

  async createPurchase({ productId, customerId }: createPurschaseParams) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error('Product not found.');
    }

    const purchase = await this.prisma.purchase.create({
      data: {
        productId,
        customerId,
      },
    });

    const customer = await this.prisma.customer.findUnique({
      where: {
        id: customerId,
      },
    });

    this.kafka.emit('purchases.new-purchase', {
      customer: {
        authUserId: customer.authUserId,
      },
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
      },
    });

    return purchase;
  }
}
