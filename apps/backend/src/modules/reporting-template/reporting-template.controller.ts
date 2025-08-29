import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ReportTemplate } from '@prisma/client';
import { BaseResponse } from 'src/commons/dto/base-response.dto';
import { CreateReportingTemplateDto } from './dto/create-reporting-template.dto';
import { UpdateReportingTemplateDto } from './dto/update-reporting-template.dto';
import { ReportingTemplateService } from './reporting-template.service';

@Controller('reporting-template')
export class ReportingTemplateController {
  constructor(private readonly reportingTemplateService: ReportingTemplateService) {}

  @Post()
  create(@Body() createReportingTemplateDto: CreateReportingTemplateDto) {
    return this.reportingTemplateService.create(createReportingTemplateDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<BaseResponse<ReportTemplate[]>> {
    return await this.reportingTemplateService.findAllWithPagination(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReportTemplate | null> {
    return await this.reportingTemplateService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReportingTemplateDto: UpdateReportingTemplateDto
  ): Promise<ReportTemplate> {
    return await this.reportingTemplateService.update(id, updateReportingTemplateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ReportTemplate> {
    return await this.reportingTemplateService.remove(id);
  }

  @Get(':id/template-data')
  async download(@Param('id') id: string) {
    return await this.reportingTemplateService.getTemplateData(id);
  }
}
