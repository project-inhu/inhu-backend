import { AdminAccountCoreRepository } from '@libs/core/admin-account/admin-account-core.repository';
import { AdminAccountCoreService } from '@libs/core/admin-account/admin-account-core.service';
import { Module } from '@nestjs/common';

/**
 * 관리자 계정 코어 모듈
 *
 * @publicApi
 */
@Module({
  imports: [],
  providers: [AdminAccountCoreService, AdminAccountCoreRepository],
  exports: [AdminAccountCoreService],
})
export class AdminAccountModule {}
