import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@app/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { UserEntity } from '@app/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenService } from './refresh-token.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

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

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.refreshTokenService.generateAndUpsert(
      user.id,
      deviceId,
    );

    return {
      accessToken,
      refreshToken,
      deviceId,
      user,
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const createdUser = await this.usersService.create(signUpDto);
    const deviceId = uuidv4();

    const accessToken = await this.generateAccessToken(createdUser);
    const refreshToken = await this.refreshTokenService.generateAndUpsert(
      createdUser.id,
      deviceId,
    );

    return {
      accessToken,
      refreshToken,
      deviceId,
      user: createdUser,
    };
  }

  async refresh(
    refreshTokenFromCookie: string,
    deviceId: string,
    userId: UserEntity['id'],
  ) {
    const tokenRecord = await this.refreshTokenService.verify(
      userId,
      deviceId,
      refreshTokenFromCookie,
    );

    if (!tokenRecord) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne({ id: userId });

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.refreshTokenService.generateAndUpsert(
      user.id,
      deviceId,
    );

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async logout(userId: UserEntity['id'], deviceId: string): Promise<void> {
    await this.refreshTokenService.remove(userId, deviceId);
  }

  private async generateAccessToken(user: UserEntity) {
    const payload: JwtPayload = { sub: user.id, role: user.role };

    return this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: Number(process.env.ACCESS_TOKEN_TTL),
    });
  }
}
