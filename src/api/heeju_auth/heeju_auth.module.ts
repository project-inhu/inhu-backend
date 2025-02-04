import { Module } from '@nestjs/common';
import { HeejuAuthController } from './heeju_auth.controller';
import { HeejuAuthService } from './heeju_auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [HttpModule,
  JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [HeejuAuthController],
  providers: [HeejuAuthService]
})
export class HeejuAuthModule {}
