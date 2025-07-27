import { PartialType } from '@nestjs/swagger';
import { CreateReviewInput } from './create-review.input';

export class UpdateReviewInput extends PartialType(CreateReviewInput) {}
