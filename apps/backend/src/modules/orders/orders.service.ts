import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Order, Product, StatusOrder } from '@prisma/client';
import dayjs from 'dayjs';
import { PrismaService } from 'nestjs-prisma';
import { BaseResponse } from 'src/commons/dto/base-response.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOrder, UiOrder, UiOrderItem } from './orders.model';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateOrderNumber(): Promise<string> {
    const count = await this.prisma.order.count();
    const seq = (count + 1).toString().padStart(6, '0');
    return `INV-${seq}`;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    if (!dto.orderItems || dto.orderItems.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    return await this.prisma.$transaction(async (tx) => {
      const productIds = dto.orderItems.map((i) => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });
      if (products.length !== productIds.length) {
        throw new BadRequestException('One or more products do not exist');
      }
      const productById: Record<string, Product> = products.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
      const decrementProduct: Record<string, number> = {};
      const computedItems = dto.orderItems.map((i) => {
        const product = productById[i.productId]!;
        const price = product.price;
        const totalPrice = price * i.quantity;
        if (dto.status === StatusOrder.PAID && i.quantity > product.quantity) {
          throw new BadRequestException(`Max quantity for ${product.name} is ${product.quantity}`);
        }
        decrementProduct[i.productId] = i.quantity;
        return {
          productId: i.productId,
          quantity: i.quantity,
          price,
          totalPrice,
          productName: product.name,
        };
      });

      const orderNumber = await this.generateOrderNumber();
      const totalPrice = computedItems.reduce((acc, cur) => acc + cur.totalPrice, 0);

      const order = await tx.order.create({
        data: {
          orderNumber,
          totalPrice,
          orderItems: { create: computedItems },
          status: dto.status,
        },
      });

      if (dto.status === StatusOrder.PAID) {
        for (const [productId, decQty] of Object.entries(decrementProduct)) {
          if (decQty > 0) {
            await tx.product.update({
              where: { id: productId },
              data: {
                quantity: { decrement: decQty },
              },
            });
          }
        }
      }

      return order;
    });
  }

  async findAllWithPagination(
    page: number = 1,
    limit: number = 20,
    search: string = ''
  ): Promise<BaseResponse<Order[]>> {
    const data = await this.prisma.order.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'asc' },
      where: {
        orderNumber: { contains: search, mode: 'insensitive' },
      },
      include: {
        orderItems: true,
      },
    });

    const total = await this.prisma.order.count();

    return {
      data,
      pagination: { page, limit, total },
    };
  }

  async findOne(id: string): Promise<Order | null> {
    return await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    return await this.prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({ where: { id }, include: { orderItems: true } });
      if (!existing) {
        throw new NotFoundException('Order not found');
      }

      let nextTotal = existing.totalPrice;
      let computedItems = [];
      let productById: Record<string, Product> = {};
      const decrementProduct: Record<string, number> = {};
      if (dto.orderItems && dto.orderItems.length > 0) {
        const productIds = dto.orderItems.map((i) => i.productId);
        const products = await tx.product.findMany({
          where: { id: { in: productIds } },
        });
        if (products.length !== productIds.length) {
          throw new BadRequestException('One or more products do not exist');
        }
        productById = products.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
        computedItems = dto.orderItems.map((i) => {
          const product = productById[i.productId]!;
          const price = product.price;
          const totalPrice = price * i.quantity;
          if (dto.status === StatusOrder.PAID && i.quantity > product.quantity) {
            throw new BadRequestException(`Max quantity for ${product.name} is ${product.quantity}`);
          }
          decrementProduct[i.productId] = i.quantity;
          return { productId: i.productId, quantity: i.quantity, price, totalPrice, productName: product.name };
        });
        nextTotal = computedItems.reduce((acc, cur) => acc + cur.totalPrice, 0);

        await tx.orderItem.deleteMany({ where: { orderId: id } });
        await tx.orderItem.createMany({
          data: computedItems.map((ci) => ({ ...ci, orderId: id })),
        });
      }

      const updated = await tx.order.update({
        where: { id },
        data: {
          totalPrice: nextTotal,
          status: dto.status as StatusOrder | undefined,
        },
      });
      if (dto.status === StatusOrder.PAID) {
        for (const [productId, decQty] of Object.entries(decrementProduct)) {
          if (decQty > 0) {
            await tx.product.update({
              where: { id: productId },
              data: {
                quantity: { decrement: decQty },
              },
            });
          }
        }
      }

      return updated;
    });
  }

  async remove(id: string): Promise<Order> {
    return await this.prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({ where: { orderId: id } });
      const deleted = await tx.order.delete({ where: { id } });
      return deleted;
    });
  }

  async getOrdersOverview() {
    const totalOrder = await this.prisma.order.count();
    const totalPending = await this.prisma.order.count({ where: { status: 'PENDING' } });
    const totalPaid = await this.prisma.order.count({ where: { status: 'PAID' } });
    const totalCancelled = await this.prisma.order.count({ where: { status: 'CANCELLED' } });

    return {
      totalOrder,
      totalPending,
      totalPaid,
      totalCancelled,
    };
  }

  transformOrderApiToUi(order: ApiOrder): UiOrder {
    const baseDate = order.createdAt ?? order.updatedAt;
    const orderDay = baseDate ? dayjs(baseDate).toDate().toLocaleDateString() : '';

    const orderItems: UiOrderItem[] = (order.orderItems || []).map((i) => ({
      productName: i.productName ?? i.product?.name ?? '',
      quantity: i.quantity ?? 0,
      price: i.price ?? 0,
      totalPrice: i.totalPrice ?? 0,
      sku: i.product?.sku,
      description: i.product?.description,
      category: i.product?.category,
    }));

    return {
      orderNumber: order.orderNumber,
      status: order.status,
      totalPrice: order.totalPrice,
      orderDay,
      orderItems,
    };
  }
}
