import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { ReportingTemplateModule } from './modules/reporting-template/reporting-template.module';

@Module({
  imports: [
    PrismaModule.forRoot({ isGlobal: true }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    AccountModule,
    ReportingTemplateModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
