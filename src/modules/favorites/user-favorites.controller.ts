import { Controller, Get, SerializeOptions } from '@nestjs/common';
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
@Controller(`${Routes.USERS}/${Routes.ME}/${Routes.FAVORITES}`)
export class UserFavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @Roles('CUSTOMER')
  findAllByUser(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<FavoriteEntity[]> {
    return this.favoritesService.findAllByUser(currentUser.id);
  }
}
