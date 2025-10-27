import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ required: false })
  brand?: string;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false })
  rating?: number;
}
