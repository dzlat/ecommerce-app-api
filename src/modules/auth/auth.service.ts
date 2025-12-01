import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { UserEntity } from '@modules/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenService } from './refresh-token.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.findOne({ email });

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        throw new UnauthorizedException();
      }

      return user;
    } catch {
      throw new UnauthorizedException();
    }
  }

  async signIn(user: UserEntity) {
    const deviceId = uuidv4();

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

  //TODO: refactor
  async refresh(user: UserEntity, refreshTokenDto: RefreshTokenDto) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.refreshTokenService.generateAndUpsert(
      user.id,
      refreshTokenDto.deviceId,
    );

    return {
      accessToken,
      refreshToken,
      deviceId: refreshTokenDto.deviceId,
      user,
    };
  }

  async logout(userId: UserEntity['id'], deviceId: string): Promise<void> {
    await this.refreshTokenService.remove(userId, deviceId);
  }

  private async generateAccessToken(user: UserEntity) {
    const payload: JwtPayload = { sub: user.id };

    return this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: Number(process.env.ACCESS_TOKEN_TTL),
    });
  }
}
