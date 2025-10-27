import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  async findAll(): Promise<Cat[]> {
    await wait(10000);
    return this.cats;
  }
}
