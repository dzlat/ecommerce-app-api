import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserEntity } from '@app/users/entities/user.entity';

export class AuthEntity {
  @ApiProperty()
  accessToken: string;

  @Type(() => UserEntity)
  @ApiProperty()
  user: UserEntity;
}
