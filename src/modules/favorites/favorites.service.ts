import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@modules/database/database.service';
import { FavoriteEntity } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(private dbService: DatabaseService) {}

  async create(userId: string, productId: string): Promise<FavoriteEntity> {
    const result = await this.dbService.favorite.create({
      data: {
        Product: {
          connect: {
            id: productId,
          },
        },
        User: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        Product: true,
      },
    });

    return result.Product;
  }

  async findAllByUser(userId: string) {
    const result = await this.dbService.favorite.findMany({
      where: { userId },
      include: {
        Product: true,
      },
    });

    return result.map((item) => item.Product);
  }

  async remove(userId: string, productId: string): Promise<void> {
    await this.dbService.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }
}
