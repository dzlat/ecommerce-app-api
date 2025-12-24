import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from 'generated/prisma';

export class ProductFiltersEntity {
  @ApiProperty({ enum: Object.values($Enums.MovieFormat), isArray: true })
  formats: $Enums.MovieFormat[];

  prices: {
    min?: number;
    max?: number;
  };
}
