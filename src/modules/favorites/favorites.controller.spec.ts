import { Test, TestingModule } from '@nestjs/testing';
import { ProductFavoritesController } from './product-favorites.controller';
import { FavoritesService } from './favorites.service';

describe('FavoritesController', () => {
  let controller: ProductFavoritesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductFavoritesController],
      providers: [FavoritesService],
    }).compile();

    controller = module.get<ProductFavoritesController>(
      ProductFavoritesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
