import { AdminAccountModule } from '@libs/core/admin-account/admin-account-core.module';
import { Module } from '@nestjs/common';
import { HashModule } from 'apps/admin-server/src/common/modules/hash/hash.module';
import { LoginTokenModule } from 'apps/admin-server/src/common/modules/login-token/login-token.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [AdminAccountModule, HashModule, LoginTokenModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
