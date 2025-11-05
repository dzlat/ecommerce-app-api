import { ProductEntity } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IPaginatedData } from '@common/interfaces/paginated-data.interface';
import { Type } from 'class-transformer';

export class PaginatedProductEntity implements IPaginatedData<ProductEntity> {
  @ApiProperty({ type: ProductEntity, isArray: true })
  @Type(() => ProductEntity)
  data: ProductEntity[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  pages: number;

  @ApiProperty()
  perPage: number;
}
