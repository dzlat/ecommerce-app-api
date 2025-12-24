import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SerializeOptions,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Public } from '@modules/auth/decorators/public.decorator';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MovieEntity } from './entities/movie.entity';
import { Routes } from '@common/enums/routes';
import { MovieFiltersDataEntity } from './entities/movie-filters-data.entity';
import { PaginatedMovieEntity } from './entities/paginated-movie.entity';
import { FindMoviesQueryDto } from './dto/find-movies-query.dto';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@common/constants';

@SerializeOptions({ type: MovieEntity })
@Controller(Routes.MOVIES)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @Roles('ADMIN')
  @ApiBearerAuth()
  create(@Body() createMovieDto: CreateMovieDto): Promise<MovieEntity> {
    return this.moviesService.create(createMovieDto);
  }

  @Public()
  @Get(Routes.ALL)
  findAll(): Promise<MovieEntity[]> {
    return this.moviesService.findAll();
  }

  @Public()
  @Get()
  findMovies(
    @Query() query: FindMoviesQueryDto,
  ): Promise<PaginatedMovieEntity> {
    const {
      page = DEFAULT_PAGE,
      perPage = DEFAULT_PER_PAGE,
      sort_by,
      sort_order,
    } = query;

    return this.moviesService.findMovies({
      page,
      perPage,
      sortBy: sort_by,
      sortOrder: sort_order,
    });
  }

  @SerializeOptions({ type: MovieFiltersDataEntity })
  @Public()
  @Get(Routes.FILTERS)
  getMoviesFilters(): Promise<MovieFiltersDataEntity> {
    return this.moviesService.getMoviesFiltersData();
  }

  @Public()
  @Get(Routes.FEATURED)
  findAllFeatured(): Promise<MovieEntity[]> {
    return this.moviesService.findAllFeatured();
  }

  @Public()
  @Public()
  @Get(':slug')
  findOne(@Param('slug') id: string): Promise<MovieEntity> {
    return this.moviesService.findOne(id);
  }

  @Patch(':slug')
  @Roles('ADMIN')
  @ApiBearerAuth()
  update(
    @Param('slug') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<MovieEntity> {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':slug')
  @Roles('ADMIN')
  @ApiBearerAuth()
  remove(@Param('slug') slug: string): Promise<MovieEntity> {
    return this.moviesService.remove(slug);
  }
}
