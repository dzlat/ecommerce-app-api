import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductsService {
  constructor(private readonly dbService: DatabaseService) {}

  create(createProductDto: Prisma.ProductCreateInput) {
    return this.dbService.product.create({
      data: createProductDto,
    });
  }

  findAll() {
    return this.dbService.product.findMany();
  }

  async findOne(id: string) {
    const foundProduct = await this.dbService.product.findUnique({
      where: {
        id,
      },
    });

    if (!foundProduct) {
      throw new NotFoundException('Product was not found');
    }

    return foundProduct;
  }

  async update(id: string, updateProductDto: Prisma.ProductUpdateInput) {
    try {
      const updatedProduct = await this.dbService.product.update({
        where: { id },
        data: updateProductDto,
      });

      return updatedProduct;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2018') {
          throw new NotFoundException('Product with such ID was not found');
        }
      }
    }
  }

  async remove(id: string) {
    try {
      const removedProduct = await this.dbService.product.delete({
        where: { id },
      });

      return removedProduct;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2018') {
          throw new NotFoundException('Product with such ID was not found');
        }
      }
    }
    return `This action removes a #${id} product`;
  }
}
