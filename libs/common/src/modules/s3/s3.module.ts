import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import s3Config from './config/s3.config';

@Module({
  imports: [ConfigModule.forFeature(s3Config)],
  providers: [
    S3Service,
    {
      provide: s3Config.KEY,
      useFactory: (config: ConfigType<typeof s3Config>) => config,
      inject: [s3Config.KEY],
    },
  ],
  exports: [S3Service, s3Config.KEY],
})
export class S3Module {}
