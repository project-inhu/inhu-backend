import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepository } from './review.repository';

@Module({
    controllers: [ReviewController],
    providers: [ReviewService, ReviewRepository],
    exports: [ReviewRepository]
})
export class ReviewModule { }
