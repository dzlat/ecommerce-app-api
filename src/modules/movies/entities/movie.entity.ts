import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Movie, Product } from 'generated/prisma';

type MovieWithProducts = Movie & { Products: Product[] };

export class MovieEntity implements Movie {
  id: string;

  title: string;

  description: string;

  featured: boolean;

  slug: string;

  @ApiProperty({ enum: Object.values($Enums.Genre) })
  genre: $Enums.Genre;

  rating: number | null;

  createdAt: Date;

  updatedAt: Date;

  startingPrice: number | null;

  year: number;

  @ApiProperty({ enum: Object.values($Enums.MovieFormat), isArray: true })
  availableFormats: $Enums.MovieFormat[];

  constructor(partial: Partial<MovieEntity>) {
    Object.assign(this, partial);
  }

  static fromPrisma(movieWithProducts: MovieWithProducts): MovieEntity {
    const { Products, ...rest } = movieWithProducts;

    const startingPrice = Products.length
      ? Math.min(...Products.map((p) => p.price.toNumber()))
      : null;

    const availableFormats = [...new Set(Products.map((p) => p.format))];

    return new MovieEntity({
      ...rest,
      startingPrice,
      availableFormats,
    });
  }

  static fromPrismaArray(
    moviesWithProducts: MovieWithProducts[],
  ): MovieEntity[] {
    return moviesWithProducts.map((movieWithProduct) =>
      this.fromPrisma(movieWithProduct),
    );
  }
}
