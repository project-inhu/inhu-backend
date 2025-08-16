import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import Redlock from 'redlock';
import { RedlockService } from './redlock.service';
import redlockConfig from './config/redlock.config';
import { REDLOCK_TOKEN } from './constants/redlock.constants';

@Module({
  imports: [ConfigModule.forFeature(redlockConfig)],
  providers: [
    {
      provide: REDLOCK_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisHosts =
          configService.get<string>('redlock.REDLOCK_URIS') || '';

        const redisClients = redisHosts.split(' ').map((hostPort) => {
          const [host, port] = hostPort.split(':');
          return new Redis({ host, port: Number(port) });
        });

        const redlock = new Redlock(redisClients, {
          driftFactor: 0.01,
          retryCount: 10,
          retryDelay: 200,
          retryJitter: 200,
        });
        redlock.on('clientError', (err) => {
          console.error('A redis error has occurred:', err);
        });
        return redlock;
      },
    },
    RedlockService,
  ],
  exports: [RedlockService, REDLOCK_TOKEN],
})
export class RedlockModule {}
