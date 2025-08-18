import { ConflictException } from '@nestjs/common';

export class NotClosedPermanentlyPlaceException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
