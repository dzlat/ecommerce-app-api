import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { MovieReviewsController } from './movie-reviews.controller';
import { DatabaseModule } from '@modules/database/database.module';
import { UserReviewsController } from './user-reviews.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [MovieReviewsController, UserReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
