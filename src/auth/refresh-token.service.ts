import { DatabaseService } from '@app/database/database.service';
import { UserEntity } from '@app/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const ROUNDS_OF_HASHING = 10;

@Injectable()
export class RefreshTokenService {
  constructor(private readonly db: DatabaseService) {}

  async addToken(
    userId: UserEntity['id'],
    deviceId: string,
    plainToken: string,
  ) {
    const hashedToken = await bcrypt.hash(plainToken, ROUNDS_OF_HASHING);

    await this.db.refreshToken.create({
      data: { userId, deviceId, tokenHash: hashedToken },
    });
  }

  async removeToken(userId: UserEntity['id'], deviceId: string) {
    await this.db.refreshToken.delete({
      where: { deviceId_userId: { userId, deviceId } },
    });
  }

  async updateToken(
    userId: UserEntity['id'],
    deviceId: string,
    plainToken: string,
  ) {
    const hashedToken = await bcrypt.hash(plainToken, ROUNDS_OF_HASHING);

    await this.db.refreshToken.update({
      where: { deviceId_userId: { userId, deviceId } },
      data: { tokenHash: hashedToken },
    });
  }

  async checkIfTokenIsWhitelisted(
    userId: UserEntity['id'],
    deviceId: string,
  ): Promise<boolean> {
    const token = await this.db.refreshToken.findUnique({
      where: { deviceId_userId: { deviceId, userId } },
    });

    return !!token;
  }
}
