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
import { AuthInfoFromRequest } from '@modules/auth/decorators/user-from-token.decorator';
import type { AuthInfo } from '@modules/auth/interfaces/auth-info.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { FavoriteEntity } from './entities/favorite.entity';

@ApiTags('Favorites')
@ApiBearerAuth()
@SerializeOptions({ type: FavoriteEntity })
@Controller('products/:productId/favorites')
export class ProductFavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @Roles('CUSTOMER')
  create(
    @AuthInfoFromRequest() authInfo: AuthInfo,
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<FavoriteEntity> {
    return this.favoritesService.create(authInfo.userId, productId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  @Roles('CUSTOMER')
  remove(
    @Param('productId', ParseUUIDPipe) productId: string,
    @AuthInfoFromRequest() authInfo: AuthInfo,
  ): Promise<void> {
    return this.favoritesService.remove(authInfo.userId, productId);
  }
}
