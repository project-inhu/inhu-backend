import { Module } from '@nestjs/common';
import { HeejuAuthController } from './heeju_auth.controller';
import { HeejuAuthService } from './heeju_auth.service';

@Module({
  controllers: [HeejuAuthController],
  providers: [HeejuAuthService]
})
export class HeejuAuthModule {}
