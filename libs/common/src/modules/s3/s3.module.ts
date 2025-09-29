import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ConfigModule } from '@nestjs/config';
import s3Config from './config/s3.config';
import { HttpModule } from '@nestjs/axios';

/**
 * S3 모듈
 *
 * @publicApi
 */
@Module({
  imports: [HttpModule, ConfigModule.forFeature(s3Config)],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
