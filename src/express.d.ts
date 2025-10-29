import { UserFromTokenEntity } from './auth/entities/user-from-token.entity';

declare module 'express' {
  interface Request {
    user?: UserFromTokenEntity;
  }
}
