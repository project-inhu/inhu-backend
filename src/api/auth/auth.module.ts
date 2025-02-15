import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { AuthRepository } from './auth.repository';
import { KakaoAuthService } from './service/kakao-auth.service';

@Module({
  imports: [HttpModule,
  JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    KakaoAuthService,
    {
      provide: APP_GUARD,
      useClass : AuthGuard
    },
    Reflector
  ]
})
export class AuthModule {}
