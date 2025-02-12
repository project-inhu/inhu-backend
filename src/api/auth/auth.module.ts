import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { AuthRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { KakaoAuthService } from './service/kakao-auth.service';
import { SocialAuthFactory } from './factories/social-auth.factory';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    JwtModule.register({
      global: true,
      secret: 'Secret1234',
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    AuthRepository,
    KakaoAuthService,
    SocialAuthFactory,
  ],
  exports: [AuthService],
})
export class AuthModule {}
