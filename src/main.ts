import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // app.enableCors({
  //   origin: 'http://localhost:3000', // 클라이언트 도메인 (프론트엔드 주소)
  //   credentials: true, // 쿠키 허용
  // });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
