import { NotFoundException } from '@nestjs/common';

export class BannerNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
