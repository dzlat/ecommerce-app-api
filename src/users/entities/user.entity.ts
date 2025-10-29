import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { $Enums, User } from 'generated/prisma';

export class UserEntity implements User {
  constructor(user: User) {
    Object.assign(this, user);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  role: $Enums.Role;

  @Exclude()
  password: string;
}
