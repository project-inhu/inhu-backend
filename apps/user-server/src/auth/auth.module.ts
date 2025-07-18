import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './common/guards/auth.guard';
import { KakaoStrategy } from './strategies/social-login/kakao/kakao.strategy';
import { LoginTokenService } from './services/login-token.service';
import { UserModule } from '@user/api/user/user.module';
import { TokenStorageStrategy } from './strategies/storages/base/token-storage.strategy';
import { InMemoryTokenStorage } from './strategies/storages/in-memory-token.storage';
import { AppleStrategy } from './strategies/social-login/apple/apple.strategy';
import { SocialTokenService } from './strategies/social-login/services/social-token.service';

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
  providers: [
    AuthService,
    AuthGuard,
    KakaoStrategy,
    AppleStrategy,
    LoginTokenService,
    { provide: TokenStorageStrategy, useClass: InMemoryTokenStorage },
    SocialTokenService,
  ],
  exports: [AuthService, LoginTokenService],
})
export class AuthModule {}
