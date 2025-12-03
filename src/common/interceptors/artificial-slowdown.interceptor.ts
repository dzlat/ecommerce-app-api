import { sleep } from '@common/utils/sleep';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ArtificialSlowdownInterceptor implements NestInterceptor {
  constructor(private readonly delayMs: number = 1000) {} // Default delay of 1 second

  async intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    console.log(`Delaying request by ${this.delayMs}ms...`);
    await sleep(this.delayMs);
    return next.handle();
  }
}
