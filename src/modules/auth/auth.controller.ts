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
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthEntity } from './entities/auth.entity';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from './decorators/public.decorator';
import type { Response } from 'express';
import { DEVICE_ID_COOKIE, REFRESH_TOKEN_COOKIE } from './constants';
import { Cookies } from './decorators/cookies.decorator';
import { RefreshTokenService } from './refresh-token.service';
import { SessionEntity } from './entities/session.entity';
import { Routes } from '@common/enums/routes';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserEntity } from '@modules/users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@SerializeOptions({ type: AuthEntity })
@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post(Routes.LOGIN)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SignInDto })
  async login(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<AuthEntity> {
    const { accessToken, refreshToken, user, deviceId } =
      await this.authService.signIn(currentUser);

    this.setCookie(response, refreshToken, deviceId);

    return {
      accessToken,
      refreshToken,
      deviceId,
      user,
    };
  }

  @Public()
  @Post(Routes.REGISTER)
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

  @Public()
  @Post(Routes.REFRESH)
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() currentUser: UserEntity,
    @Cookies(DEVICE_ID_COOKIE) deviceId: string,
  ): Promise<AuthEntity> {
    const { accessToken, refreshToken, user } = await this.authService.refresh(
      deviceId,
      currentUser.id,
    );

    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  @Post(Routes.LOGOUT)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  logout(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() currentUser: UserEntity,
    @Cookies(DEVICE_ID_COOKIE) deviceId: string,
  ) {
    this.clearCookie(response);

    if (deviceId) {
      return this.authService.logout(currentUser.id, deviceId);
    }
  }

  @Get(Routes.SESSIONS)
  @SerializeOptions({ type: SessionEntity })
  @ApiBearerAuth()
  sessions(@CurrentUser() currentUser: UserEntity): Promise<SessionEntity[]> {
    return this.refreshTokenService.findAllByUser(currentUser.id);
  }

  @Delete(`${Routes.SESSIONS}/:id`)
  @ApiBearerAuth()
  terminate(@Param('id') id: string) {
    return this.refreshTokenService.removeBySessionId(id);
  }

  @Delete(Routes.SESSIONS)
  @ApiBearerAuth()
  terminateAll(
    @CurrentUser() currentUser: UserEntity,
    @Cookies(DEVICE_ID_COOKIE) deviceId: string,
  ) {
    return this.refreshTokenService.removeAllByUser(currentUser.id, deviceId);
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
