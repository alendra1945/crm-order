import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { BaseResponse } from 'src/commons/dto/base-response.dto';
import { CreateProductRequest } from './dto/create-product.dto';
import { UpdateProductRequest } from './dto/update-product.dto';
@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductRequest): Promise<Product> {
    return await this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAllWithPagination(
    page: number = 1,
    limit: number = 20,
    search: string = ''
  ): Promise<BaseResponse<Product[]>> {
    const data = await this.prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'asc' },
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
        ],
      },
    });
    const total = await this.prisma.product.count();

    return {
      data,
      pagination: { page, limit, total },
    };
  }

  async findOne(id: string): Promise<Product | null> {
    return await this.prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateProductDto: UpdateProductRequest): Promise<Product> {
    console.log(updateProductDto);
    return await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string): Promise<Product> {
    return await this.prisma.product.delete({
      where: { id },
    });
  }

  async getProductOverview() {
    const totalProduct = await this.prisma.product.count();
    const totalOutOfStock = await this.prisma.product.count({ where: { quantity: 0 } });
    const totalInStockProduct = await this.prisma.product.count({ where: { quantity: { gt: 0 } } });
    return {
      totalProduct,
      totalInStockProduct,
      totalOutOfStock,
    };
  }
}
