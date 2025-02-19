import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/module/prisma/prisma.module';
import { PlaceModule } from './api/place/place.module';
import { ReviewService } from './api/review/review.service';
import { ReviewModule } from './api/review/review.module';

@Module({
  imports: [PrismaModule, PlaceModule, ReviewModule],
  controllers: [AppController],
  providers: [AppService, ReviewService],
})
export class AppModule {}
