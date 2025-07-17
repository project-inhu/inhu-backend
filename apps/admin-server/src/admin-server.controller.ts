import { Controller, Get } from '@nestjs/common';
import { AdminServerService } from './admin-server.service';

@Controller()
export class AdminServerController {
  constructor(private readonly adminServerService: AdminServerService) {}

  @Get()
  getHello(): string {
    return this.adminServerService.getHello();
  }
}
