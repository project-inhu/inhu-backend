import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { getMode } from '@user/common/utils/get-mode.util';
import { DiscordWebhookService } from '@libs/common/modules/discord-webhook/discord-webhook.service';
import { DiscordWebhookContext } from '@libs/common/modules/discord-webhook/constants/discord-webhook-context.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  if (getMode() === 'production') {
    await app
      .get(DiscordWebhookService)
      .sendWebhookMessage(
        `🚀 ${DiscordWebhookContext.USER_SERVER} 배포 알림 `,
        `서버가 성공적으로 배포 되었습니다.`,
      );
  }

  const config = new DocumentBuilder()
    .setTitle('Inhu API')
    .setDescription('Inhu API')
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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
