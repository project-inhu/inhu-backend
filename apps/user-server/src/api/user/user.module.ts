import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '@user/auth/auth.module';
import { S3Module } from '@user/common/module/s3/s3.module';

@Module({
  imports: [forwardRef(() => AuthModule), S3Module],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
