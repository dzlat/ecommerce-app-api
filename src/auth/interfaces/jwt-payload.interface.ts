import { UserEntity } from '@app/users/entities/user.entity';

export interface JwtPayload {
  sub: UserEntity['id'];
  role: UserEntity['role'];
}
