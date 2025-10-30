import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
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
import { UserFromToken } from './decorators/user-from-token.decorator';
import { UserFromTokenEntity } from './entities/user-from-token.entity';

@SerializeOptions({ type: AuthEntity })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    response.cookie(DEVICE_ID_COOKIE, deviceId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });

    return {
      accessToken,
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
    const { accessToken, refreshToken, user } =
      await this.authService.signUp(signUpDto);

    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      accessToken,
      user,
    };
  }

  @ApiBearerAuth()
  @Post('refresh')
  @ApiCreatedResponse({ type: AuthEntity })
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @UserFromToken() userFromToken: UserFromTokenEntity,
    @Cookies(DEVICE_ID_COOKIE) deviceId?: string,
    @Cookies(REFRESH_TOKEN_COOKIE) refreshTokenFromCookie?: string,
  ): Promise<AuthEntity> {
    if (!refreshTokenFromCookie || !deviceId) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken, user } = await this.authService.refresh(
      refreshTokenFromCookie,
      deviceId,
      userFromToken.sub,
    );

    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken);

    return {
      accessToken,
      user,
    };
  }

  @ApiBearerAuth()
  @Post('logout')
  logout(
    @Res({ passthrough: true }) response: Response,
    @UserFromToken() userFromToken: UserFromTokenEntity,
    @Cookies(DEVICE_ID_COOKIE) deviceId: string,
  ) {
    response.clearCookie(REFRESH_TOKEN_COOKIE, { sameSite: 'lax' });
    response.clearCookie(DEVICE_ID_COOKIE, { sameSite: 'lax' });

    if (deviceId) {
      return this.authService.logout(userFromToken.sub, deviceId);
    }
  }
}
