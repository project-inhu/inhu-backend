import { ConflictException } from '@nestjs/common';

export class AlreadyNotBookmarkException extends ConflictException {
  constructor(message?: string) {
    super(message);
  }
}
