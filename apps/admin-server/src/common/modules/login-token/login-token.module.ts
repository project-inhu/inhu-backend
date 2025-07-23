import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'apps/admin-server/src/common/modules/login-token/config/jwt.config';
import { LoginTokenService } from 'apps/admin-server/src/common/modules/login-token/login-token.service';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt').secret,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LoginTokenService],
  exports: [LoginTokenService],
})
export class LoginTokenModule {}
