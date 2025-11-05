import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ProductFavoritesController } from './product-favorites.controller';
import { DatabaseModule } from '@modules/database/database.module';
import { UserFavoritesController } from './user-favorites.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductFavoritesController, UserFavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
