import { NotFoundException } from '@nestjs/common';

export class NaverBlogNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super(message);
  }
}
