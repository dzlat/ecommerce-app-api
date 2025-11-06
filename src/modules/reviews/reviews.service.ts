import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { DatabaseService } from '@modules/database/database.service';
import { ReviewEntity } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(private dbService: DatabaseService) {}

  create(
    movieId: string,
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<ReviewEntity> {
    return this.dbService.review.create({
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

  update(id: string, updateReviewDto: UpdateReviewDto): Promise<ReviewEntity> {
    return this.dbService.review.update({
      where: {
        id,
      },
      data: updateReviewDto,
    });
  }

  remove(id: string): Promise<ReviewEntity> {
    return this.dbService.review.delete({
      where: {
        id,
      },
    });
  }
}
