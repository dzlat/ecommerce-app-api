import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Routes } from '@common/enums/routes';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { UserEntity } from '@modules/users/entities/user.entity';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReviewEntity } from './entities/review.entity';

@ApiTags('Reviews')
@ApiBearerAuth()
@Controller(`${Routes.ME}/${Routes.REVIEWS}`)
export class UserReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles('CUSTOMER')
  @Get()
  findAllByUser(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ReviewEntity[]> {
    return this.reviewsService.findAllByUser(currentUser.id);
  }

  @Roles('CUSTOMER')
  @Patch(':reviewId')
  async update(
    @Param('reviewId') reviewId: string,
    @CurrentUser() currentUser: UserEntity,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewEntity> {
    const isOwnReview = await this.reviewsService.checkIfOwnReview(
      reviewId,
      currentUser.id,
    );

    if (!isOwnReview) {
      throw new ForbiddenException();
    }

    return this.reviewsService.update(reviewId, updateReviewDto);
  }

  @Delete(':reviewId')
  async delete(
    @Param('reviewId') reviewId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ReviewEntity> {
    const isOwnReview = await this.reviewsService.checkIfOwnReview(
      reviewId,
      currentUser.id,
    );

    if (!isOwnReview) {
      throw new ForbiddenException();
    }

    return this.reviewsService.remove(reviewId);
  }
}
