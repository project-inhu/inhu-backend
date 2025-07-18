import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminServerService {
  getHello(): string {
    return 'Hello World!';
  }
}
