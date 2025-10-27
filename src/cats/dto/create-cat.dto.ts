import { Cat } from '../interfaces/cat.interface';
import { IsInt, IsString } from 'class-validator';

export class CreateCatDto implements Cat {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
