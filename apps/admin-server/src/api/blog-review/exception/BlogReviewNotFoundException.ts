import { NotFoundException } from '@nestjs/common';

export class BlogReviewNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
