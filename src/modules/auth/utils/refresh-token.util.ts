import { randomBytes, createHash } from 'crypto';

export function generateOpaqueToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url');
}

// Optional: only if you want to centralize hashing here instead of using bcrypt in the service
export function hashTokenSHA256(token: string): string {
  return createHash('sha256').update(token).digest('base64url');
}
