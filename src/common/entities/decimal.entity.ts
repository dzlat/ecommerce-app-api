import { Prisma } from '@generated/prisma';

export class DecimalPatch extends Prisma.Decimal {
  constructor(value?: Prisma.Decimal.Value) {
    super(value ?? 0);
  }
}
