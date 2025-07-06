import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/module/prisma/prisma.module';
import { PlaceModule } from './api/place/place.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { KeywordModule } from './api/keyword/keyword.module';
import { ReviewModule } from './api/review/review.module';
import { S3Module } from './common/s3/s3.module';

@Module({
  imports: [
    PrismaModule,
    PlaceModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ReviewModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
