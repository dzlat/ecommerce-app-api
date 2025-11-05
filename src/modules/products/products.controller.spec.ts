import { Test, TestingModule } from '@nestjs/testing';
import { MovieProductsController } from './movie-products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: MovieProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieProductsController],
      providers: [ProductsService],
    }).compile();

    controller = module.get<MovieProductsController>(MovieProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
