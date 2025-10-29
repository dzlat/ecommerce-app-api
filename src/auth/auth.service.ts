import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthEntity } from './entities/auth.entity';
import { UserFromTokenEntity } from './entities/user-from-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<AuthEntity> {
    const user = await this.usersService.findOne({ email: signInDto.email });

    const isPasswordMatch = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }

    const payload: UserFromTokenEntity = { sub: user.id, role: user.role };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user,
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthEntity> {
    const createdUser = await this.usersService.create(signUpDto);

    const payload: UserFromTokenEntity = {
      sub: createdUser.name,
      role: createdUser.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: createdUser,
    };
  }
}
