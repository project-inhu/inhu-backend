import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { KakaoAddressService } from './kakao-address.service';

@Module({
  imports: [HttpModule],
  providers: [KakaoAddressService],
  exports: [KakaoAddressService],
})
export class KakaoAddressModule {}
