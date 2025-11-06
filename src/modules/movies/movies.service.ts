import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { DatabaseService } from '@modules/database/database.service';

@Injectable()
export class MoviesService {
  constructor(private readonly dbService: DatabaseService) {}

  create(createMovieDto: CreateMovieDto) {
    return this.dbService.movie.create({ data: createMovieDto });
  }

  findAll() {
    return this.dbService.movie.findMany();
  }

  async findOne(id: string) {
    const movie = await this.dbService.movie.findUnique({ where: { id } });

    if (!movie) {
      throw new NotFoundException();
    }

    return movie;
  }

  update(id: string, updateMovieDto: UpdateMovieDto) {
    return this.dbService.movie.update({ where: { id }, data: updateMovieDto });
  }

  remove(id: string) {
    return this.dbService.movie.delete({ where: { id } });
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
