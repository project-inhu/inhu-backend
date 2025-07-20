import { UserCoreModule } from '@libs/core';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from '@user/api/auth/auth.controller';
import kakaoLoginConfig from '@user/api/auth/social-login/strategy/kakao/config/kakao-login.config';
import appleLoginConfig from './social-login/strategy/apple/config/apple-login.config';
import { LoginTokenModule } from '@user/common/module/login-token/login-token.module';
import { AuthService } from '@user/api/auth/auth.service';
import { KakaoLoginStrategy } from '@user/api/auth/social-login/strategy/kakao/kakao-login.strategy';
import { AppleLoginStrategy } from '@user/api/auth/social-login/strategy/apple/apple-login.strategy';
import { JwtModule } from '@nestjs/jwt';
import authConfig from '@user/api/auth/config/auth.config';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forFeature(kakaoLoginConfig),
    ConfigModule.forFeature(appleLoginConfig),
    ConfigModule.forFeature(authConfig),
    UserCoreModule,
    LoginTokenModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, KakaoLoginStrategy, AppleLoginStrategy],
})
export class AuthModule {}
