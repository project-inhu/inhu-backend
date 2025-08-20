import { Inject, Injectable } from '@nestjs/common';
import { REDLOCK_TOKEN } from './constants/redlock.constants';
import Redlock, { Lock } from 'redlock';

@Injectable()
export class RedlockService {
  constructor(@Inject(REDLOCK_TOKEN) private readonly redlock: Redlock) {}

  async acquireLock(key: string, ttl: number): Promise<Lock> {
    return await this.redlock.acquire([key], ttl);
  }
}
