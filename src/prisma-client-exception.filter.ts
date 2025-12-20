import { ErrorEntity } from '@common/entities/error.entity';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { Prisma } from 'generated/prisma';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        const target = (exception.meta?.target as string[]) || ['field'];

        const error: ErrorEntity = {
          message: 'Failed to add a record',
          errors: target.map((field) => ({
            field,
            message: `${field} must be unique`,
          })),
        };

        response.status(status).json(error);
        break;
      }
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;

        const error: ErrorEntity = {
          message: 'The requested resource was not found',
          errors: [],
        };

        response.status(status).json(error);
        break;
      }
      default: {
        super.catch(exception, host);
        break;
      }
    }

    super.catch(exception, host);
  }
}
