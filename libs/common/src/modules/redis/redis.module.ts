import { redisConfig } from '@libs/common/modules/redis/config/redis.config';
import { RedisService } from '@libs/common/modules/redis/redis.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [
    RedisService,
    {
      useValue: '',
      provide: 'REDIS_PREFIX',
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
