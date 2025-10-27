import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProductsModule } from './products/products.module';
import { CatsController } from './cats/cats.controller';
import { CatsModule } from './cats/cats.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ProductsModule, CatsModule, UsersModule],
  controllers: [AppController, CatsController],
  providers: [AppService],
})
export class AppModule {}
