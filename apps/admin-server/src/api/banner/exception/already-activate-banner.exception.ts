import { ConflictException } from '@nestjs/common';

export class AlreadyActivatedBannerException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
