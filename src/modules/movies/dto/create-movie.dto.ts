import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from 'generated/prisma';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsEnum($Enums.Genre)
  @ApiProperty({ enum: Object.values($Enums.Genre) })
  genre: $Enums.Genre;
}
