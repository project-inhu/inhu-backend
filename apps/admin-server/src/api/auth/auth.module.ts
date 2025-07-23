import { AdminAccountModule } from '@libs/core/admin-account/admin-account-core.module';
import { Module } from '@nestjs/common';
import { AuthService } from '@user/api/auth/auth.service';
import { AuthController } from 'apps/admin-server/src/api/auth/auth.controller';
import { HashModule } from 'apps/admin-server/src/common/modules/hash/hash.module';
import { LoginTokenModule } from 'apps/admin-server/src/common/modules/login-token/login-token.module';

@Module({
  imports: [AdminAccountModule, HashModule, LoginTokenModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
