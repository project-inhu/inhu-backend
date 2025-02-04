import { Module } from '@nestjs/common';
import { AuthController } from './gongsil_auth.controller';
import { AuthService } from './gongsil_auth.service';
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
  controllers: [AuthController],
  providers: [AuthService],
})
export class GongsilAuthModule {}
