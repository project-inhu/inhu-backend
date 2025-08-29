import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { KakaoAddressService } from './kakao-address.service';
import { ConfigModule } from '@nestjs/config';
import kakaoAddressConfig from './config/kakao-address.config';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(kakaoAddressConfig)],
  providers: [KakaoAddressService],
  exports: [KakaoAddressService],
})
export class KakaoAddressModule {}
