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
import { RefreshTokenService } from './refresh-token.service';
import { SessionEntity } from './entities/session.entity';
import { Routes } from '@common/enums/routes';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserEntity } from '@modules/users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { TerminateAllSessionsDto } from './dto/terminate-all-sessions.dto';

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
    return this.authService.signIn(currentUser);
  }

  @Public()
  @Post(Routes.REGISTER)
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthEntity> {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Post(Routes.REFRESH)
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @CurrentUser() currentUser: UserEntity,
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthEntity> {
    return this.authService.refresh(currentUser, refreshTokenDto);
  }

  @Post(Routes.LOGOUT)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  logout(
    @Body() logoutDto: LogoutDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<void> {
    return this.authService.logout(currentUser.id, logoutDto.deviceId);
  }

  @Get(Routes.SESSIONS)
  @SerializeOptions({ type: SessionEntity })
  @ApiBearerAuth()
  sessions(@CurrentUser() currentUser: UserEntity): Promise<SessionEntity[]> {
    return this.refreshTokenService.findAllByUser(currentUser.id);
  }

  @Delete(`${Routes.SESSIONS}/:id`)
  @ApiBearerAuth()
  terminate(@Param('id') id: string): Promise<void> {
    return this.refreshTokenService.removeBySessionId(id);
  }

  @Delete(Routes.SESSIONS)
  @ApiBearerAuth()
  terminateAll(
    @CurrentUser() currentUser: UserEntity,
    @Body() terminateAllSessionsDto: TerminateAllSessionsDto,
  ): Promise<void> {
    return this.refreshTokenService.removeAllByUser(
      currentUser.id,
      terminateAllSessionsDto.deviceId,
    );
  }
}
