import { UserEntity } from '@modules/users/entities/user.entity';

export interface JwtPayload {
  sub: UserEntity['id'];
  role: UserEntity['role'];
}
