import { UserCoreRepository } from '@libs/core/user/user-core.repository';
import { UserCoreService } from '@libs/core/user/user-core.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [UserCoreService, UserCoreRepository],
  exports: [UserCoreService],
})
export class UserCoreModule {}
