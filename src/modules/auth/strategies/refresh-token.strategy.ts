import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { DEVICE_ID_COOKIE, REFRESH_TOKEN_COOKIE } from '../constants';
import { RefreshTokenService } from '../refresh-token.service';
import { UsersService } from '@modules/users/users.service';

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
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE] as
      | string
      | undefined;
    const deviceId = req.cookies[DEVICE_ID_COOKIE] as string | undefined;

    if (!refreshToken || !deviceId) {
      throw new UnauthorizedException('Refresh token not found in cookies');
    }

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
