import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from '@user/api/auth/auth.controller';
import kakaoLoginConfig from '@user/api/auth/social-login/strategy/kakao/config/kakao-login.config';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(kakaoLoginConfig)],
  providers: [],
  controllers: [AuthController],
})
export class AuthModule {}
