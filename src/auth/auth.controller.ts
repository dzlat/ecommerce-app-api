import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  SerializeOptions,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthEntity } from './entities/auth.entity';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from './decorators/public.decorator';
import type { Response } from 'express';
import { DEVICE_ID_COOKIE, REFRESH_TOKEN_COOKIE } from './constants';
import { Cookies } from './decorators/cookies.decorator';
import { AuthInfoPipe } from './decorators/user-from-token.decorator';
import type { AuthInfo } from './interfaces/auth-info.interface';
import { RefreshTokenService } from './refresh-token.service';
import { SessionEntity } from './entities/session.entity';

@SerializeOptions({ type: AuthEntity })
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthEntity> {
    const { accessToken, refreshToken, user, deviceId } =
      await this.authService.signIn(signInDto);

    this.setCookie(response, refreshToken, deviceId);

    return {
      accessToken,
      refreshToken,
      deviceId,
      user,
    };
  }

  @Public()
  @Post('register')
  @ApiCreatedResponse({ type: AuthEntity })
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthEntity> {
    const { accessToken, refreshToken, user, deviceId } =
      await this.authService.signUp(signUpDto);

    this.setCookie(response, refreshToken, deviceId);

    return {
      accessToken,
      refreshToken,
      deviceId,
      user,
    };
  }

  @ApiBearerAuth()
  @Post('refresh')
  @ApiCreatedResponse({ type: AuthEntity })
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @AuthInfoPipe() authInfo: AuthInfo,
    @Cookies(DEVICE_ID_COOKIE) deviceId?: string,
    @Cookies(REFRESH_TOKEN_COOKIE) refreshTokenFromCookie?: string,
  ): Promise<AuthEntity> {
    if (!refreshTokenFromCookie || !deviceId) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken, user } = await this.authService.refresh(
      refreshTokenFromCookie,
      deviceId,
      authInfo.userId,
    );

    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  logout(
    @Res({ passthrough: true }) response: Response,
    @AuthInfoPipe() authInfo: AuthInfo,
    @Cookies(DEVICE_ID_COOKIE) deviceId: string,
  ) {
    this.clearCookie(response);

    if (deviceId) {
      return this.authService.logout(authInfo.userId, deviceId);
    }
  }

  @Get('sessions')
  @SerializeOptions({ type: SessionEntity })
  @ApiOkResponse({ type: SessionEntity })
  @ApiBearerAuth()
  sessions(@AuthInfoPipe() authInfo: AuthInfo) {
    return this.refreshTokenService.findAllByUser(authInfo.userId);
  }

  @Delete('sessions/:id')
  @ApiBearerAuth()
  terminate(@Param('id') id: string) {
    return this.refreshTokenService.removeBySessionId(id);
  }

  @Delete('sessions')
  @ApiBearerAuth()
  terminateAll(
    @AuthInfoPipe() authInfo: AuthInfo,
    @Cookies(DEVICE_ID_COOKIE) deviceId: string,
  ) {
    return this.refreshTokenService.removeAllByUser(authInfo.userId, deviceId);
  }

  private setCookie(
    response: Response,
    refreshToken: string,
    deviceId: string,
  ) {
    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: Number(process.env.REFRESH_TOKEN_TTL),
    });
    response.cookie(DEVICE_ID_COOKIE, deviceId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: Number(process.env.DEVICE_ID_COOKIE_TTL), // 1 year
    });
  }

  private clearCookie(response: Response) {
    response.clearCookie(REFRESH_TOKEN_COOKIE, { sameSite: 'lax' });
    response.clearCookie(DEVICE_ID_COOKIE, { sameSite: 'lax' });
  }
}
