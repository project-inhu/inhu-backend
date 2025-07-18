import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import s3Config from './config/s3.config';

@Module({
  imports: [
    ConfigModule.forFeature(s3Config), // `s3Config` (배열 아님)
  ],
  providers: [
    S3Service,
    {
      provide: s3Config.KEY, // 주입 토큰: 's3'
      useFactory: (config: ConfigType<typeof s3Config>) => config, // 팩토리: 주입받은 config 반환
      inject: [s3Config.KEY], // 주입할 대상: s3Config.KEY
    },
  ],
  exports: [S3Service, s3Config.KEY], // S3Service와 s3Config.KEY를 외부로 내보냄
})
export class S3Module {}
