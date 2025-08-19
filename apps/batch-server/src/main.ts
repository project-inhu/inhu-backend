import { NestFactory } from '@nestjs/core';
import { BatchServerModule } from './batch-server.module';

async function bootstrap() {
  const app = await NestFactory.create(BatchServerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
