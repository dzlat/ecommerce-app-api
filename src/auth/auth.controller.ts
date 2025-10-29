import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthEntity } from './entities/auth.entity';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from './decorators/public.decorator';

@SerializeOptions({ type: AuthEntity })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiOkResponse({ type: AuthEntity })
  signIn(@Body() signInDto: SignInDto): Promise<AuthEntity> {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @Post('/register')
  @ApiCreatedResponse({ type: AuthEntity })
  signUp(@Body() signUpDto: SignUpDto): Promise<AuthEntity> {
    return this.authService.signUp(signUpDto);
  }
}
