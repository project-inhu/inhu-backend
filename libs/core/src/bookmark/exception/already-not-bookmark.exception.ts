import { ConflictException } from '@nestjs/common';

/**
 * 이미 북마크가 존재하지 않는 경우 발생하는 예외
 *
 * @publicApi
 */
export class AlreadyNotBookmarkException extends ConflictException {
  constructor(message?: string) {
    super(message);
  }
}
