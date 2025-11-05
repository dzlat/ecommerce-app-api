import { AuthInfo } from '@modules/auth/interfaces/auth-info.interface';

declare module 'express' {
  interface Request {
    user?: AuthInfo;
  }
}
