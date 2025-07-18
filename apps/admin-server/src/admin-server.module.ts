import { Module } from '@nestjs/common';
import { AdminServerController } from './admin-server.controller';
import { AdminServerService } from './admin-server.service';

@Module({
  imports: [],
  controllers: [AdminServerController],
  providers: [AdminServerService],
})
export class AdminServerModule {}
