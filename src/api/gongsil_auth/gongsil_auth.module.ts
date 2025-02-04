import { Module } from '@nestjs/common';
import { GongsilAuthController } from './gongsil_auth.controller';
import { GongsilAuthService } from './gongsil_auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({
      secret: 'gongsilsecret',
      signOptions: {
        expiresIn: '1m',
      },
    }),
  ],
  controllers: [GongsilAuthController],
  providers: [GongsilAuthService],
})
export class GongsilAuthModule {}
