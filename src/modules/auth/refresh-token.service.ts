import { DatabaseService } from '@modules/database/database.service';
import { UserEntity } from '@modules/users/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { generateOpaqueToken } from './utils/refresh-token.util';
import { RefreshToken } from '@generated/prisma';

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
      where: { deviceId },
      create: { userId, deviceId, tokenHash, expiresAt },
      update: { tokenHash, expiresAt },
    });

    return plainToken;
  }

  async remove(userId: UserEntity['id'], deviceId: string) {
    const token = await this.findOne(deviceId);

    if (!token || token.userId !== userId) {
      throw new UnauthorizedException();
    }

    await this.db.refreshToken.delete({
      where: { deviceId },
    });
  }

  async removeBySessionId(sessionId: RefreshToken['id']) {
    await this.db.refreshToken.delete({
      where: { id: sessionId },
    });
  }

  async removeAllByUser(userId: UserEntity['id'], deviceId: string) {
    await this.db.refreshToken.deleteMany({
      where: {
        userId,
        NOT: { deviceId },
      },
    });
  }

  async findOne(deviceId: string) {
    return this.db.refreshToken.findUnique({
      where: { deviceId },
    });
  }

  async findAllByUser(userId: UserEntity['id']) {
    return this.db.refreshToken.findMany({ where: { userId } });
  }

  async verify(deviceId: string, plainToken: string) {
    const record = await this.findOne(deviceId);
    if (!record) return null;

    const match = await bcrypt.compare(plainToken, record.tokenHash);
    if (!match) return null;

    if (record.expiresAt.getTime() <= Date.now()) return null;

    return record;
  }
}
