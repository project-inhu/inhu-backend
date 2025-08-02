import { ConflictException } from '@nestjs/common';

/**
 * 이미 북마크가 존재하는 경우 발생하는 예외
 *
 * @publicApi
 */
export class AlreadyBookmarkException extends ConflictException {
  constructor(message?: string) {
    super(message);
  }
}
