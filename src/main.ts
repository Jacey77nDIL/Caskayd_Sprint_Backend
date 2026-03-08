import 'reflect-metadata';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://caskayd-sprint-frontend.vercel.app',
      'https://caskayd.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on ${port}`);
}

bootstrap();