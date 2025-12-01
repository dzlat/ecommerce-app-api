import { IsString } from 'class-validator';
import { LogoutDto } from './logout.dto';

export class RefreshTokenDto extends LogoutDto {
  @IsString()
  refreshToken: string;
}
