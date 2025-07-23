import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AdminServerModule } from './admin-server.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminServerModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(' '),
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Inhu Back office API')
    .setDescription('Inhu Back office API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, customOptions);

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
