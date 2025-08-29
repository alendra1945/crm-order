import { PartialType } from '@nestjs/swagger';
import { CreateReportingTemplateDto } from './create-reporting-template.dto';
import { IsOptional } from 'class-validator';

export class UpdateReportingTemplateDto extends PartialType(CreateReportingTemplateDto) {
  @IsOptional()
  source?: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  @IsOptional()
  metadata?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
