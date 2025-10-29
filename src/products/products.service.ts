import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly dbService: DatabaseService) {}

  create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    return this.dbService.product.create({
      data: createProductDto,
    });
  }

  findAll(): Promise<ProductEntity[]> {
    return this.dbService.product.findMany();
  }

  findOne(id: string): Promise<ProductEntity | null> {
    return this.dbService.product.findUnique({
      where: {
        id,
      },
    });
  }

  update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.dbService.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: string): Promise<ProductEntity> {
    return this.dbService.product.delete({
      where: { id },
    });
  }
}
