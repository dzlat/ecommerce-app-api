import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { DatabaseService } from '@modules/database/database.service';

@Injectable()
export class ProductsService {
  constructor(private readonly dbService: DatabaseService) {}

  create(
    movieId: string,
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.dbService.product.create({
      data: {
        ...createProductDto,
        Movie: { connect: { id: movieId } },
      },
    });
  }

  findAll(movieId: string): Promise<ProductEntity[]> {
    return this.dbService.product.findMany({ where: { movieId } });
  }

  async findOne(id: string): Promise<ProductEntity | null> {
    return this.dbService.product.findUnique({
      where: {
        id,
      },
    });
  }

  update(
    movieId: string,
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.dbService.product.update({
      where: { movieId: movieId, id: productId },
      data: updateProductDto,
    });
  }

  remove(movieId: string, productId: string): Promise<ProductEntity> {
    return this.dbService.product.delete({
      where: { id: productId, movieId },
    });
  }
}
