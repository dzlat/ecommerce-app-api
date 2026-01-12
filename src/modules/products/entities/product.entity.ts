import { DecimalProperty } from '@common/decorators/decimal.decorator';
import { DecimalPatch } from '@common/entities/decimal.entity';
import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Product } from '@prisma/generated';

export class ProductEntity implements Product {
  @ApiProperty()
  id: string;

  @ApiProperty()
  movieId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ enum: Object.values($Enums.MovieFormat) })
  format: $Enums.MovieFormat;

  @DecimalProperty()
  @ApiProperty({ type: 'number' })
  originalPrice: DecimalPatch;

  @DecimalProperty()
  @ApiProperty({ type: 'number' })
  price: DecimalPatch;
}
