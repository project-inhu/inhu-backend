import { Module } from '@nestjs/common';
import { AuthController } from './gongsil_auth.controller';
import { AuthService } from './gongsil_auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { AuthRepository } from './gongsil_auth.repository';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        secret: ConfigService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1m',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthRepository,
  ],
})
export class AuthModule {}
