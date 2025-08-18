import { ConflictException } from '@nestjs/common';

export class AlreadyActivatedPlaceException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
