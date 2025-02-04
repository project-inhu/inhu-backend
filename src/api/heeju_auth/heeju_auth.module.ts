import { Module } from '@nestjs/common';
import { HeejuAuthController } from './heeju_auth.controller';
import { HeejuAuthService } from './heeju_auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports : [HttpModule],
  controllers: [HeejuAuthController],
  providers: [HeejuAuthService]
})
export class HeejuAuthModule {}
