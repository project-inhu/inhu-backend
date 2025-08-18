import { UnauthorizedException } from '@nestjs/common';

export class InvalidAccessTokenException extends UnauthorizedException {
  constructor(message?: string) {
    super(message);
  }
}
