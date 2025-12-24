import { Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { DatabaseService } from '@modules/database/database.service';
import { MovieEntity } from './entities/movie.entity';
import { MovieFiltersDataEntity } from './entities/movie-filters-data.entity';

@Injectable()
export class MoviesService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(createMovieDto: CreateMovieDto): Promise<MovieEntity> {
    const slug = slugify(createMovieDto.title);

    const data = await this.dbService.movie.create({
      data: { ...createMovieDto, slug },
      include: {
        Products: true,
      },
    });

    return MovieEntity.fromPrisma(data);
  }

  async findAll(): Promise<MovieEntity[]> {
    const movies = await this.dbService.movie.findMany({
      include: { Products: true },
    });
    return MovieEntity.fromPrismaArray(movies);
  }

  async findAllFeatured(): Promise<MovieEntity[]> {
    const movies = await this.dbService.movie.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      where: {
        featured: true,
      },
      include: {
        Products: true,
      },
      take: 9,
    });

    const moviesWithProducts = movies.filter((movie) => movie.Products.length);

    return MovieEntity.fromPrismaArray(moviesWithProducts);
  }

  async findOne(slug: string): Promise<MovieEntity> {
    const movie = await this.dbService.movie.findUnique({
      where: { slug },
      include: { Products: true },
    });

    if (!movie) {
      throw new NotFoundException();
    }

    return MovieEntity.fromPrisma(movie);
  }

  async update(
    id: string,
    updateMovieDto: UpdateMovieDto,
  ): Promise<MovieEntity> {
    const newMovieData: UpdateMovieDto & { slug?: string } = updateMovieDto;

    if (newMovieData.title) {
      newMovieData.slug = slugify(newMovieData.title);
    }

    const movie = await this.dbService.movie.update({
      where: { id },
      data: newMovieData,
      include: {
        Products: true,
      },
    });

    return MovieEntity.fromPrisma(movie);
  }

  async remove(id: string): Promise<MovieEntity> {
    const movie = await this.dbService.movie.delete({
      where: { id },
      include: { Products: true },
    });

    return MovieEntity.fromPrisma(movie);
  }

  async getMoviesFiltersData(): Promise<MovieFiltersDataEntity> {
    const genres = await this.dbService.movie.findMany({
      include: {
        Products: true,
      },
      distinct: ['genre'],
    });

    return { genres: genres.map((m) => m.genre) };
  }

  // TODO: learn SQL more to find a way how to do it better
  async actualizeMovieRating(movieId: string) {
    const movieWithAllReviews = await this.dbService.movie.findUnique({
      where: {
        id: movieId,
      },
      include: {
        Reviews: true,
      },
    });

    if (!movieWithAllReviews) return;

    const { Reviews } = movieWithAllReviews;

    const movieAverageRating =
      Reviews.reduce((sum, review) => sum + review.rating, 0) / Reviews.length;

    await this.dbService.movie.update({
      where: { id: movieId },
      data: { rating: movieAverageRating },
    });
  }
}
