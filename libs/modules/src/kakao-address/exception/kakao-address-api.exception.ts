import { NotFoundException } from '@nestjs/common';

export class KakaoAddressAPIException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
