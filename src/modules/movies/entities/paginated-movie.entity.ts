import { IPaginatedData } from '@common/interfaces/paginated-data.interface';
import { MovieEntity } from './movie.entity';
import { Type } from 'class-transformer';

export class PaginatedMovieEntity implements IPaginatedData<MovieEntity> {
  @Type(() => MovieEntity)
  data: MovieEntity[];
  page: number;
  total: number;
  pages: number;
  perPage: number;
}
