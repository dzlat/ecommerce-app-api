import { IsNotEmpty, IsUUID } from 'class-validator';

export class LogoutDto {
  @IsUUID()
  @IsNotEmpty()
  deviceId: string;
}
