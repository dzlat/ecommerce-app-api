import { UserEntity } from '@app/users/entities/user.entity';

export interface AuthInfo {
  userId: UserEntity['id'];
  role: UserEntity['role'];
}
