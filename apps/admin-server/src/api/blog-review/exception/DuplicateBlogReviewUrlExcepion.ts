import { ConflictException } from '@nestjs/common';

export class DuplicateBlogReviewUrlException extends ConflictException {
  constructor(message?: string) {
    super(message);
  }
}
