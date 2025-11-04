import { UserEntity } from '@modules/users/entities/user.entity';

export interface AuthInfo {
  userId: UserEntity['id'];
  role: UserEntity['role'];
}
