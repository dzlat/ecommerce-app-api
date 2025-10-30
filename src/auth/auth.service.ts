import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@app/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { UserFromTokenEntity } from './entities/user-from-token.entity';
import { UserEntity } from '@app/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOne({ email: signInDto.email });
    const deviceId = uuidv4();

    const isPasswordMatch = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }

    const [accessToken, refreshToken] = await this.generateTokenPair(user);

    await this.refreshTokenService.addToken(user.id, deviceId, refreshToken);

    return {
      accessToken,
      refreshToken,
      user,
      deviceId,
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const createdUser = await this.usersService.create(signUpDto);
    const deviceId = uuidv4();

    const [accessToken, refreshToken] =
      await this.generateTokenPair(createdUser);

    await this.refreshTokenService.addToken(
      createdUser.id,
      deviceId,
      refreshToken,
    );

    return {
      accessToken,
      refreshToken,
      user: createdUser,
    };
  }

  private generateTokenPair(userData: UserEntity) {
    const payload: UserFromTokenEntity = {
      sub: userData.id,
      role: userData.role,
    };

    return Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '2 days',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7 days',
      }),
    ]);
  }

  async refresh(
    refreshTokenFromCookie: string,
    deviceId: string,
    userId: UserEntity['id'],
  ) {
    const isWhitelistedToken =
      await this.refreshTokenService.checkIfTokenIsWhitelisted(
        userId,
        deviceId,
      );

    if (!isWhitelistedToken) {
      throw new UnauthorizedException();
    }

    let userFromToken: UserFromTokenEntity;

    try {
      userFromToken = await this.jwtService.verifyAsync<UserFromTokenEntity>(
        refreshTokenFromCookie,
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
        },
      );
    } catch {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne({ id: userFromToken.sub });

    const [accessToken, refreshToken] = await this.generateTokenPair(user);

    await this.refreshTokenService.updateToken(user.id, deviceId, refreshToken);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async logout(userId: UserEntity['id'], deviceId: string): Promise<void> {
    await this.refreshTokenService.removeToken(userId, deviceId);
  }
}
