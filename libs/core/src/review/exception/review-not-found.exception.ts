import { NotFoundException } from '@nestjs/common';

/**
 * 리뷰를 찾을 수 없을 때 발생하는 예외 클래스
 *
 * @publicApi
 */
export class ReviewNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super(message);
  }
}
