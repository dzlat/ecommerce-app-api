import { UserEntity } from '@modules/users/entities/user.entity';

export interface JwtPayload {
  sub: UserEntity['id'];
}

export interface DecodedJwtPayload extends JwtPayload {
  iat: number;
  exp: number;
}
