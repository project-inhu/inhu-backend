import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepository } from './review.repository';
import { PrismaModule } from 'src/common/module/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { PlaceModule } from '../place/place.module';
import { KeywordModule } from '../keyword/keyword.module';

@Module({
  imports: [PrismaModule, AuthModule, PlaceModule, KeywordModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
  exports: [ReviewRepository, ReviewService],
})
export class ReviewModule {}
