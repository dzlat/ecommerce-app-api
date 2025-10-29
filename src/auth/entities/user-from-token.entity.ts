import { $Enums } from 'generated/prisma';

export class UserFromTokenEntity {
  sub: string;
  role: $Enums.Role;
}
