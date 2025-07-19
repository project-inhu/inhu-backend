import { CreateReviewInput } from './create-review.input';
import { PartialType } from '@nestjs/swagger';

export class UpdateReviewInput extends PartialType(CreateReviewInput) {}
