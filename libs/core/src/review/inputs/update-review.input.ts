import { CreateReviewInput } from '@libs/core/review/inputs/create-review.input';
import { PartialType } from '@nestjs/swagger';

export class UpdateReviewInput extends PartialType(CreateReviewInput) {}
