import { Module } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { ProductService } from '../product/product.service';
import { ReportingTemplateController } from './reporting-template.controller';
import { ReportingTemplateService } from './reporting-template.service';

@Module({
  controllers: [ReportingTemplateController],
  providers: [ReportingTemplateService, ProductService, OrdersService],
})
export class ReportingTemplateModule {}
