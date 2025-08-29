import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { BaseResponse } from 'src/commons/dto/base-response.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CreateProductRequest } from './dto/create-product.dto';
import { UpdateProductRequest } from './dto/update-product.dto';
import { ProductService } from './product.service';

@UseGuards(JwtGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductRequest: CreateProductRequest): Promise<Product> {
    return await this.productService.create(createProductRequest);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search: string
  ): Promise<BaseResponse<Product[]>> {
    return await this.productService.findAllWithPagination(page, limit, search);
  }

  @Get('overview')
  async getProductOverview() {
    return await this.productService.getProductOverview();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product | null> {
    return await this.productService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductRequest: UpdateProductRequest): Promise<Product> {
    return this.productService.update(id, updateProductRequest);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Product> {
    return await this.productService.remove(id);
  }
}
