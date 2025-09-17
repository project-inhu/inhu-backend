import { ConflictException } from '@nestjs/common';

export class AlreadyDeactivatedBannerException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
