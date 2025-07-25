import { ConflictException } from '@nestjs/common';

export class AlreadyDeactivatedPlaceException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
