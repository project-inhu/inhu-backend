import { UserCoreRepository } from '@libs/core/user/user-core.repository';
import { UserCoreService } from '@libs/core/user/user-core.service';
import { Module } from '@nestjs/common';

/**
 * 사용자 코어 모듈
 *
 * @publicApi
 */
@Module({
  providers: [UserCoreService, UserCoreRepository],
  exports: [UserCoreService],
})
export class UserCoreModule {}
