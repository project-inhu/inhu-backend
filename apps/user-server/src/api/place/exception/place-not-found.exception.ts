import { NotFoundException } from '@nestjs/common';

export class PlaceNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super(message);
  }
}
