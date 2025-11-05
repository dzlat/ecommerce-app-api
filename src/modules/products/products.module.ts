import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MovieProductsController } from './movie-products.controller';
import { DatabaseModule } from '@modules/database/database.module';
import { ProductsController } from './products.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [MovieProductsController, ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
