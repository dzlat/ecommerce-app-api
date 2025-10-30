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
import { REFRESH_TOKEN_COOKIE } from './constants';
import { Cookies } from './decorators/cookies.decorator';

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
    const { accessToken, refreshToken, user } =
      await this.authService.signIn(signInDto);

    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken);

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

    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken);

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
    @Cookies(REFRESH_TOKEN_COOKIE) refreshTokenFromCookie?: string,
  ): Promise<AuthEntity> {
    if (!refreshTokenFromCookie) {
      throw new UnauthorizedException();
    }

    console.log(refreshTokenFromCookie);

    const { accessToken, refreshToken, user } = await this.authService.refresh(
      refreshTokenFromCookie,
    );

    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken);

    return {
      accessToken,
      user,
    };
  }
}
