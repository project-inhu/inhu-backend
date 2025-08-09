import { BadRequestException } from '@nestjs/common';

export class InvalidIdOrPwException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
