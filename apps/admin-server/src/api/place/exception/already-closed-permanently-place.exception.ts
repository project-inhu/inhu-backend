import { ConflictException } from '@nestjs/common';

export class AlreadyClosedPermanentlyPlaceException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
