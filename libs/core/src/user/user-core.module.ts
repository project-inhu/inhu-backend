import { Module } from '@nestjs/common';
import { UserRepository } from '@user/api/user/user.repository';
import { UserService } from '@user/api/user/user.service';

@Module({
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserCoreModule {}
