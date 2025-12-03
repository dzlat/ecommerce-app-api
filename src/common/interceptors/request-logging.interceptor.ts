import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const method = request.method;
    const url = request.url;
    const body = request.body;

    this.logger.log(
      `Incoming request: ${method} ${url} - Body: ${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - now;
        this.logger.log(`Request completed: ${method} ${url} - ${ms}ms`);
      }),
    );
  }
}
