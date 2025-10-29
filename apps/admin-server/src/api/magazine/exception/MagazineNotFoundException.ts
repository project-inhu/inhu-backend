import { NotFoundException } from '@nestjs/common';

export class MagazineNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super(message);
  }
}
