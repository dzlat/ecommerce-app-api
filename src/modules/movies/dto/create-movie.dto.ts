import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/generated';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum($Enums.Genre)
  @ApiProperty({ enum: Object.values($Enums.Genre) })
  genre: $Enums.Genre;

  @IsNumber()
  @IsNotEmpty()
  year: number;
}
