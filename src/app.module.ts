import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/module/prisma/prisma.module';
import { PlaceModule } from './api/place/place.module';
import { ReviewModule } from './api/review/review.module';
import { GongsilAuthModule } from './api/gongsil_auth/gongsil_auth.module';

@Module({
  imports: [PrismaModule, PlaceModule, ReviewModule, GongsilAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
