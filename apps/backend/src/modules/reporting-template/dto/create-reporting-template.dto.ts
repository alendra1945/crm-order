import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReportingTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  documentTarget: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
