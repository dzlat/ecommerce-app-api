import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from 'generated/prisma';
import { IsEnum, IsInt, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsInt()
  @Min(0)
  @ApiProperty({ minimum: 0, default: 0 })
  quantity: number;

  @IsEnum($Enums.MovieFormat)
  @ApiProperty({ enum: Object.values($Enums.MovieFormat) })
  format: $Enums.MovieFormat;

  @IsNumber()
  @Min(0)
  @ApiProperty({ minimum: 0 })
  originalPrice: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ minimum: 0 })
  price: number;
}
