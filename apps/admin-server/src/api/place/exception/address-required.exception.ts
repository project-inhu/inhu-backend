import { BadRequestException } from '@nestjs/common';

export class AddressRequiredException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
