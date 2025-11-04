import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Movie } from 'generated/prisma';

export class MovieEntity implements Movie {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: Object.values($Enums.Genre) })
  genre: $Enums.Genre;

  @ApiProperty({ required: false, nullable: true, type: 'number' })
  rating: number | null;

  @ApiProperty({ required: false })
  createdAt: Date;

  @ApiProperty({ required: false })
  updatedAt: Date;
}
