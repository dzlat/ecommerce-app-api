import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/generated';

export class ProductFiltersEntity {
  @ApiProperty({ enum: Object.values($Enums.MovieFormat), isArray: true })
  formats: $Enums.MovieFormat[];

  prices: {
    min?: number;
    max?: number;
  };
}
