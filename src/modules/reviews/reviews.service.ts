import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { DatabaseService } from '@modules/database/database.service';
import { ReviewEntity } from './entities/review.entity';
import { MoviesService } from '@modules/movies/movies.service';

@Injectable()
export class ReviewsService {
  constructor(
    private dbService: DatabaseService,
    private moviesService: MoviesService,
  ) {}

  async create(
    movieId: string,
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<ReviewEntity> {
    const createdReview = await this.dbService.review.create({
      data: {
        ...createReviewDto,
        User: {
          connect: {
            id: userId,
          },
        },
        Movie: {
          connect: {
            id: movieId,
          },
        },
      },
    });

    await this.moviesService.actualizeMovieRating(createdReview.movieId);

    return createdReview;
  }

  findAllByUser(userId: string): Promise<ReviewEntity[]> {
    return this.dbService.review.findMany({
      where: {
        userId,
      },
    });
  }

  findAllByMovie(movieId: string): Promise<ReviewEntity[]> {
    return this.dbService.review.findMany({
      where: {
        movieId,
      },
    });
  }

  async checkIfOwnReview(reviewId: string, userId: string): Promise<boolean> {
    const review = await this.dbService.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    return review?.userId === userId;
  }

  async update(
    reviewId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewEntity> {
    const updated = await this.dbService.review.update({
      where: {
        id: reviewId,
      },
      data: updateReviewDto,
    });

    await this.moviesService.actualizeMovieRating(updated.movieId);

    return updated;
  }

  async remove(reviewId: string): Promise<ReviewEntity> {
    const removed = await this.dbService.review.delete({
      where: {
        id: reviewId,
      },
    });

    await this.moviesService.actualizeMovieRating(removed.movieId);

    return removed;
  }
}
