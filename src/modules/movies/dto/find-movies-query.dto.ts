import { $Enums } from 'generated/prisma';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsNumber, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

const TransformToArray = <T>() =>
  Transform(({ value }: { value: T[] | T }) => {
    if (Array.isArray(value)) return value;
    return typeof value === 'string' ? value.split(',') : value;
  });

export class FindMoviesQueryDto extends PaginationQueryDto {
  @ApiProperty({ enum: Object.values($Enums.Genre), isArray: true })
  @IsArray()
  @TransformToArray()
  @IsOptional()
  @IsIn(Object.values($Enums.Genre))
  genres?: $Enums.Genre[];

  @IsArray()
  @IsOptional()
  @TransformToArray()
  @IsIn(Object.values($Enums.MovieFormat))
  @ApiProperty({ enum: Object.values($Enums.MovieFormat), isArray: true })
  formats?: $Enums.MovieFormat[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @IsIn(['rating', 'year'])
  @IsOptional()
  declare sort_by?: 'rating' | 'year';
}
