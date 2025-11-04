import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthInfo } from '../interfaces/auth-info.interface';

export const AuthInfoPipe = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthInfo | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user;
  },
);
