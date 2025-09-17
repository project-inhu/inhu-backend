import { BadRequestException } from '@nestjs/common';

export class CannotUpdateInactiveBannerException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
