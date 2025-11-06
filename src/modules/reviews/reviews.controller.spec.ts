import { Test, TestingModule } from '@nestjs/testing';
import { MovieReviewsController } from './movie-reviews.controller';
import { ReviewsService } from './reviews.service';

describe('ReviewsController', () => {
  let controller: MovieReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieReviewsController],
      providers: [ReviewsService],
    }).compile();

    controller = module.get<MovieReviewsController>(MovieReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
