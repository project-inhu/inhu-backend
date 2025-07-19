import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { AuthModule } from '@user/auth/auth.module';
import { PlaceModule } from '../place/place.module';
import { KeywordModule } from '../keyword/keyword.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AuthModule, PlaceModule, KeywordModule, UserModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
