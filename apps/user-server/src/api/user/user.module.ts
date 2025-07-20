import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserCoreModule } from '@libs/core';
import { S3Module } from '@libs/common';

@Module({
  imports: [UserCoreModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
