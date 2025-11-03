import { DatabaseService } from '@app/database/database.service';
import { UserEntity } from '@app/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { generateOpaqueToken } from './utils/refresh-token.util';

const ROUNDS_OF_HASHING = 10;

@Injectable()
export class RefreshTokenService {
  constructor(private readonly db: DatabaseService) {}

  async generateAndUpsert(userId: UserEntity['id'], deviceId: string) {
    const plainToken = generateOpaqueToken();

    const tokenHash = await bcrypt.hash(plainToken, ROUNDS_OF_HASHING);
    const REFRESH_TTL_MS = Number(process.env.REFRESH_TOKEN_TTL);
    const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

    await this.db.refreshToken.upsert({
      where: { deviceId_userId: { userId, deviceId } },
      create: { userId, deviceId, tokenHash, expiresAt },
      update: { tokenHash, expiresAt },
    });

    return plainToken;
  }

  async remove(userId: UserEntity['id'], deviceId: string) {
    await this.db.refreshToken.delete({
      where: { deviceId_userId: { userId, deviceId } },
    });
  }

  async findOne(userId: UserEntity['id'], deviceId: string) {
    return this.db.refreshToken.findUnique({
      where: { deviceId_userId: { deviceId, userId } },
    });
  }

  async verify(userId: UserEntity['id'], deviceId: string, plainToken: string) {
    const record = await this.findOne(userId, deviceId);
    if (!record) return null;

    const match = await bcrypt.compare(plainToken, record.tokenHash);
    if (!match) return null;

    if (record.expiresAt.getTime() <= Date.now()) return null;

    return record;
  }
}
