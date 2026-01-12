import { Prisma } from '@prisma/generated';

export class DecimalPatch extends Prisma.Decimal {
  constructor(value?: Prisma.Decimal.Value) {
    super(value ?? 0);
  }
}
