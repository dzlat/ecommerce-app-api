import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@app/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { UserFromTokenEntity } from './entities/user-from-token.entity';
import { UserEntity } from '@app/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOne({ email: signInDto.email });

    const isPasswordMatch = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }

    const [accessToken, refreshToken] = await this.generateTokenPair(user);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const createdUser = await this.usersService.create(signUpDto);

    const [accessToken, refreshToken] =
      await this.generateTokenPair(createdUser);

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

  async refresh(refreshTokenFromCookie: string) {
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

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
