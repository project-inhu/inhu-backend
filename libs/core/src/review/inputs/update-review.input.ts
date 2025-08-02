import { CreateReviewInput } from './create-review.input';
import { PartialType } from '@nestjs/swagger';

/**
 * 리뷰 수정 입력 input
 *
 * @publicApi
 */
export class UpdateReviewInput extends PartialType(CreateReviewInput) {}
