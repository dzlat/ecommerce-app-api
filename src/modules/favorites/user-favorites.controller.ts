import { Controller, Get, SerializeOptions } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthInfoFromRequest } from '@modules/auth/decorators/user-from-token.decorator';
import type { AuthInfo } from '@modules/auth/interfaces/auth-info.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { FavoriteEntity } from './entities/favorite.entity';

@ApiTags('Favorites')
@ApiBearerAuth()
@SerializeOptions({ type: FavoriteEntity })
@Controller()
export class UserFavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('users/me/favorites')
  @Roles('CUSTOMER')
  findAllByUser(
    @AuthInfoFromRequest() authInfo: AuthInfo,
  ): Promise<FavoriteEntity[]> {
    return this.favoritesService.findAllByUser(authInfo.userId);
  }
}
