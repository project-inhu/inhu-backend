import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserCoreModule } from '@libs/core/user/user-core.module';

@Module({
  imports: [UserCoreModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
