import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './common/guards/auth.guard';
import { KakaoStrategy } from './strategies/kakao/kakao.strategy';
import { LoginTokenService } from './services/login-token.service';
import { UserModule } from 'src/api/user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, KakaoStrategy, LoginTokenService],
  exports: [AuthService, LoginTokenService],
})
export class AuthModule {}
