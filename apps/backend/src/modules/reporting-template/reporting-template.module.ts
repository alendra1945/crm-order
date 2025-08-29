import { Module } from '@nestjs/common';
import { ReportingTemplateService } from './reporting-template.service';
import { ReportingTemplateController } from './reporting-template.controller';

@Module({
  controllers: [ReportingTemplateController],
  providers: [ReportingTemplateService],
})
export class ReportingTemplateModule {}
