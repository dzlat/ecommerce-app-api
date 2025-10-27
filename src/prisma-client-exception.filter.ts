import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { Prisma } from 'generated/prisma';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter<T> extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        const message = `Unique constrains violation for the following fields: ${(exception.meta?.target as string[])?.join(', ')}`;
        response.status(status).json({
          statusCode: status,
          message,
        });
        break;
      }
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        console.log(exception);
        response.status(status).json({
          statusCode: status,
          message: exception.meta?.cause,
        });
      }
      default: {
        super.catch(exception, host);
        break;
      }
    }

    super.catch(exception, host);
  }
}
