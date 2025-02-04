import { Injectable } from "@nestjs/common";
import { ReviewRepository } from "./review.repository";
import { GetReviewsByPlaceIdDto, ReviewEntity, ReviewsByPlaceIdResponseDto } from "./review.dto";

@Injectable()
export class ReviewService {
    constructor(
        private reviewRepository: ReviewRepository
    ) { }

    async getReviewsByPlaceId(getReviewsByPlaceIdDto: GetReviewsByPlaceIdDto):
        Promise<ReviewsByPlaceIdResponseDto> {
        const reviewsQuery = await this.reviewRepository.getReviewsByPlaceId(getReviewsByPlaceIdDto);

        const reviews: ReviewEntity[] = reviewsQuery.map((review) => ({
            idx: review.idx,
            userIdx: review.idx,
            placeIdx: review.placeIdx,
            content: review.content,
            createdAt: review.createdAt.toISOString(),
            reviewImages: review.reviewImage.map(img => img.imagePath),
            reviewKeywords: review.reviewKeywordMapping.map(k => k.keyword.content)
        }))


        return { reviews };
    }
}