import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ required: false })
  brand?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ required: false })
  category?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  rating?: number;
}
