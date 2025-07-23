import { UnauthorizedException } from '@nestjs/common';

export class InvalidLoginTokenException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
