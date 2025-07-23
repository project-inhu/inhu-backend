import { AdminAccountCoreRepository } from '@libs/core/admin-account/admin-account-core.repository';
import { AdminAccountCoreService } from '@libs/core/admin-account/admin-account-core.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [AdminAccountCoreService, AdminAccountCoreRepository],
  exports: [AdminAccountCoreService],
})
export class AdminAccountModule {}
