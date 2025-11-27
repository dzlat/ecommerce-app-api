import {
  Controller,
  Post,
  Param,
  ParseUUIDPipe,
  Delete,
  SerializeOptions,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { UserEntity } from '@modules/users/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { FavoriteEntity } from './entities/favorite.entity';
import { Routes } from '@common/enums/routes';

@ApiTags('Favorites')
@ApiBearerAuth()
@SerializeOptions({ type: FavoriteEntity })
@Controller(`${Routes.PRODUCTS}/:productId/${Routes.FAVORITES}`)
export class ProductFavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @Roles('CUSTOMER')
  create(
    @CurrentUser() currentUser: UserEntity,
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<FavoriteEntity> {
    return this.favoritesService.create(currentUser.id, productId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  @Roles('CUSTOMER')
  remove(
    @Param('productId', ParseUUIDPipe) productId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<void> {
    return this.favoritesService.remove(currentUser.id, productId);
  }
}
