import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { DatabaseService } from '@modules/database/database.service';
import { PaginatedProductEntity } from './entities/paginated-product.entity';

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

  async findAll({
    page,
    perPage,
    sortBy = '',
    sortOrder,
  }: {
    page: number;
    perPage: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<PaginatedProductEntity> {
    const offset = (page - 1) * perPage;

    const totalProducts = await this.dbService.product.count();
    const results = await this.dbService.product.findMany({
      skip: offset,
      take: perPage,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const pages = Math.ceil(totalProducts / perPage);

    return {
      data: results,
      page,
      perPage,
      total: totalProducts,
      pages,
    };
  }

  findAllByMovie(movieId: string): Promise<ProductEntity[]> {
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
