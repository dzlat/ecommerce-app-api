import { Controller, Get, SerializeOptions } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthInfoFromRequest } from '@modules/auth/decorators/user-from-token.decorator';
import type { AuthInfo } from '@modules/auth/interfaces/auth-info.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { FavoriteEntity } from './entities/favorite.entity';
import { Routes } from '@common/enums/routes';

@ApiTags('Favorites')
@ApiBearerAuth()
@SerializeOptions({ type: FavoriteEntity })
@Controller(`${Routes.USERS}/${Routes.ME}/${Routes.FAVORITES}`)
export class UserFavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @Roles('CUSTOMER')
  findAllByUser(
    @AuthInfoFromRequest() authInfo: AuthInfo,
  ): Promise<FavoriteEntity[]> {
    return this.favoritesService.findAllByUser(authInfo.userId);
  }
}
