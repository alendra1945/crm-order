import { PartialType } from '@nestjs/swagger';
import { CreateProductRequest } from './create-product.dto';

export class UpdateProductRequest extends PartialType(CreateProductRequest) {}
