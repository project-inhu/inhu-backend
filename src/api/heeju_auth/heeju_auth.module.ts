import { Module } from '@nestjs/common';
import { HeejuAuthController } from './heeju_auth.controller';
import { HeejuAuthService } from './heeju_auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './heeju_auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [HttpModule,
  JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [HeejuAuthController],
  providers: [
    HeejuAuthService,
    {
      provide: APP_GUARD,
      useClass : AuthGuard
    },
    Reflector
  ]
})
export class HeejuAuthModule {}
