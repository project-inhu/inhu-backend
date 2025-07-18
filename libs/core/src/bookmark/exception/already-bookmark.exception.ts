import { ConflictException } from '@nestjs/common';

export class AlreadyBookmarkException extends ConflictException {
  constructor(message?: string) {
    super(message);
  }
}
