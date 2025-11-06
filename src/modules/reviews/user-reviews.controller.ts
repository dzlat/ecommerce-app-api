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
import { AuthInfoFromRequest } from '@modules/auth/decorators/user-from-token.decorator';
import type { AuthInfo } from '@modules/auth/interfaces/auth-info.interface';
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
    @AuthInfoFromRequest() authInfo: AuthInfo,
  ): Promise<ReviewEntity[]> {
    return this.reviewsService.findAllByUser(authInfo.userId);
  }

  @Roles('CUSTOMER')
  @Patch(':reviewId')
  async update(
    @Param('reviewId') reviewId: string,
    @AuthInfoFromRequest() authInfo: AuthInfo,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewEntity> {
    const isOwnReview = await this.reviewsService.checkIfOwnReview(
      reviewId,
      authInfo.userId,
    );

    if (!isOwnReview) {
      throw new ForbiddenException();
    }

    return this.reviewsService.update(reviewId, updateReviewDto);
  }

  @Delete(':reviewId')
  async delete(
    @Param('reviewId') reviewId: string,
    @AuthInfoFromRequest() authInfo: AuthInfo,
  ): Promise<ReviewEntity> {
    const isOwnReview = await this.reviewsService.checkIfOwnReview(
      reviewId,
      authInfo.userId,
    );

    if (!isOwnReview) {
      throw new ForbiddenException();
    }

    return this.reviewsService.remove(reviewId);
  }
}
