import { Module } from '@nestjs/common';
import { S3UploadController } from './s3-upload.controller';
import { S3UploadService } from './s3-upload.service';
import { S3Module } from '@libs/common';

@Module({
  imports: [S3Module],
  controllers: [S3UploadController],
  providers: [S3UploadService],
})
export class S3UploadModule {}
