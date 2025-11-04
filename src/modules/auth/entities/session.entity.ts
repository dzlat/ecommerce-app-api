import { RefreshToken } from '@generated/prisma';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class SessionEntity implements RefreshToken {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @Exclude()
  tokenHash: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  deviceId: string;

  @ApiProperty({ nullable: true, type: 'string' })
  userAgent: string | null;
}
