import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Routes } from '@common/enums/routes';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { Public } from '@modules/auth/decorators/public.decorator';
import { ReviewEntity } from './entities/review.entity';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { UserEntity } from '@modules/users/entities/user.entity';

@ApiTags('Reviews')
@Controller(`${Routes.MOVIES}/:movieId/${Routes.REVIEWS}`)
export class MovieReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles('CUSTOMER')
  @Post()
  @ApiBearerAuth()
  create(
    @Param('movieId', ParseUUIDPipe) movieId: string,
    @CurrentUser() currentUser: UserEntity,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewEntity> {
    return this.reviewsService.create(movieId, currentUser.id, createReviewDto);
  }

  @Public()
  @Get()
  findAllByMovie(
    @Param('movieId', ParseUUIDPipe) movieId: string,
  ): Promise<ReviewEntity[]> {
    return this.reviewsService.findAllByMovie(movieId);
  }
}
