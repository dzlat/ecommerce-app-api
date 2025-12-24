import { $Enums } from '@generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

export class MovieFiltersDataEntity {
  @ApiProperty({ enum: Object.values($Enums.Genre), isArray: true })
  genres: $Enums.Genre[];
}
