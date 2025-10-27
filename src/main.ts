import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const allowedOrigins = ['http://localhost:3000'];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: corsOptions,
  });

  const config = new DocumentBuilder()
    .setTitle('Ecommerce')
    .setDescription('The Ecommerce API description')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
