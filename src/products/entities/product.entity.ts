import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'generated/prisma';
import { Decimal } from 'generated/prisma/runtime/library';

export class ProductEntity implements Product {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ nullable: true, type: 'string', required: false })
  brand: string | null;

  @ApiProperty({ nullable: true, type: 'string', required: false })
  category: string | null;

  @ApiProperty({ nullable: true, type: 'number', required: false })
  rating: Decimal | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
