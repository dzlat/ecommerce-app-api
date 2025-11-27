import { RefreshToken } from '@generated/prisma';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class SessionEntity implements RefreshToken {
  id: string;

  userId: string;

  @ApiHideProperty()
  @Exclude()
  tokenHash: string;

  expiresAt: Date;

  createdAt: Date;

  deviceId: string;

  userAgent: string | null;
}
