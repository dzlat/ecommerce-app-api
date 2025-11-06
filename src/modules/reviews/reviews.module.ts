import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { MovieReviewsController } from './movie-reviews.controller';
import { DatabaseModule } from '@modules/database/database.module';
import { UserReviewsController } from './user-reviews.controller';
import { MoviesModule } from '@modules/movies/movies.module';

@Module({
  imports: [DatabaseModule, MoviesModule],
  controllers: [MovieReviewsController, UserReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
