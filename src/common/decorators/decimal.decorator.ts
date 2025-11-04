import { DecimalPatch } from '@common/entities/decimal.entity';
import { applyDecorators } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';

export function DecimalProperty() {
  return applyDecorators(
    Transform(({ value }: { value: DecimalPatch }) => value.toNumber(), {
      toPlainOnly: true,
    }),
    Transform(({ value }: { value: DecimalPatch }) => new DecimalPatch(value), {
      toClassOnly: true,
    }),
    Type(() => DecimalPatch),
  );
}
