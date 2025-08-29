import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { Order } from '@prisma/client';
import { BaseResponse } from 'src/commons/dto/base-response.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search: string
  ): Promise<BaseResponse<Order[]>> {
    return await this.ordersService.findAllWithPagination(page, limit, search);
  }

  @Get('overview')
  async getOrdersOverview() {
    return await this.ordersService.getOrdersOverview();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order | null> {
    return await this.ordersService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return await this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.remove(id);
  }
}
