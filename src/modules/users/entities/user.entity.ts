import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { $Enums, User } from '@prisma/generated';

export class UserEntity implements User {
  constructor(user: User) {
    Object.assign(this, user);
  }

  id: string;

  name: string;

  email: string;

  createdAt: Date;

  updatedAt: Date;

  //TODO: change OpenApi type
  role: $Enums.Role;

  @ApiHideProperty()
  @Exclude()
  password: string;
}
