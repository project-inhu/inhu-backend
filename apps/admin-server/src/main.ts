import { NestFactory } from '@nestjs/core';
import { AdminServerModule } from './admin-server.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminServerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
