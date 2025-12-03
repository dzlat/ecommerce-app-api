import { Type } from 'class-transformer';
import { UserEntity } from '@modules/users/entities/user.entity';

export class AuthEntity {
  accessToken: string;
  refreshToken: string;
  deviceId: string;
  accessTokenExpiresAt: string | null;

  @Type(() => UserEntity)
  user: UserEntity;
}
