import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { RefreshTokenService } from '../refresh-token.service';
import { UsersService } from '@modules/users/users.service';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async validate(req: Request) {
    const { refreshToken, deviceId } = req.body as RefreshTokenDto;

    const sessionRecord = await this.refreshTokenService.verify(
      deviceId,
      refreshToken,
    );

    if (!sessionRecord) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne({ id: sessionRecord.userId });

    return user;
  }
}
