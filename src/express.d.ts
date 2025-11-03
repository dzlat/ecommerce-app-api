import { UserFromRequest } from './auth/entities/user-from-request.entity';

declare module 'express' {
  interface Request {
    user?: UserFromRequest;
  }
}
