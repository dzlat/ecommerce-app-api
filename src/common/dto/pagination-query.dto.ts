import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@common/constants';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = DEFAULT_PAGE;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  perPage?: number = DEFAULT_PER_PAGE;

  @IsIn(['asc', 'desc'])
  @IsOptional()
  sort_order?: 'asc' | 'desc';

  @IsString()
  @IsOptional()
  sort_by?: string;
}
