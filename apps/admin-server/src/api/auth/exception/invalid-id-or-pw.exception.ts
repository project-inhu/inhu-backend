import { UnauthorizedException } from '@nestjs/common';

export class InvalidIdOrPwException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
