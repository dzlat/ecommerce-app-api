import { $Enums } from '@prisma/generated';
import { ApiProperty } from '@nestjs/swagger';

export class MovieFiltersDataEntity {
  @ApiProperty({ enum: Object.values($Enums.Genre), isArray: true })
  genres: $Enums.Genre[];
}
