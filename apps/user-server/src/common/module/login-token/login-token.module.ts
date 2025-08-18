import { RedisModule } from '@libs/common/modules/redis/redis.module';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import loginJwtConfig from '@user/common/module/login-token/config/login-jwt.config';
import { LoginTokenService } from '@user/common/module/login-token/login-token.service';
import { RedisStorageProvider } from '@user/common/module/login-token/storage/redis-storage/redis-storage.provider';
import { IRefreshTokenStorage } from '@user/common/module/login-token/storage/refresh-token-storage.interface';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(loginJwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(loginJwtConfig)],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('loginJwt.JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forFeature(loginJwtConfig),
    RedisModule,
  ],
  providers: [
    LoginTokenService,
    {
      provide: IRefreshTokenStorage,
      useClass: RedisStorageProvider,
    },
  ],
  exports: [LoginTokenService],
})
export class LoginTokenModule {}
