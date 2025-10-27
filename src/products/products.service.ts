import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly dbService: DatabaseService) {}

  create(createProductDto: CreateProductDto) {
    return this.dbService.product.create({
      data: createProductDto,
    });
  }

  findAll() {
    return this.dbService.product.findMany();
  }

  findOne(id: string) {
    return this.dbService.product.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.dbService.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: string) {
    return this.dbService.product.delete({
      where: { id },
    });
  }
}
