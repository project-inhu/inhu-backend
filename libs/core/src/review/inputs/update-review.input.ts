import { CreateReviewInput } from '@app/core/review/inputs/create-review.input';
import { PartialType } from '@nestjs/swagger';

export class UpdateReviewInput extends PartialType(CreateReviewInput) {}
