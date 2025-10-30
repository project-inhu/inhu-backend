import {
  Aspect,
  createDecorator,
  LazyDecorator,
  WrapParams,
} from '@toss/nestjs-aop';
import { RedlockService } from '../modules/redlock/redlock.service';
import { InternalServerErrorException } from '@nestjs/common';
import { Lock } from 'redlock';

export const LOCKER_DECORATOR = Symbol('LOCKER_DECORATOR');

export class LockOptions {
  /**
   * 락(Lock)을 구분하기 위한 고유 키.
   * - 문자열 또는 (...args) => string 형태
   */
  key: string | ((...args: any[]) => string);

  /**
   * TTL(ms).
   *
   * @default 30000
   */
  ttl?: number;
}

/**
 * @Locker(options) 데코레이터 함수
 * 이 데코레이터는 메서드에 분산 락에 필요한 설정 정보를 메타데이터로 첨부함
 *
 * @example
 *
 * 1) 고정 키
 *   @Locker({ key: 'auth:refresh-token' })
 *
 * 2) (...args) => string 방식
 *   @Locker({ key: (id: string) => `place:like:${id}`, ttl: 1000 * 30 })
 */
export const Locker = (options: LockOptions) =>
  createDecorator(LOCKER_DECORATOR, options);

@Aspect(LOCKER_DECORATOR)
export class LockerDecorator implements LazyDecorator<any, LockOptions> {
  constructor(private readonly redlockService: RedlockService) {}

  wrap(params: WrapParams<any, LockOptions>) {
    return async (...args: any[]) => {
      const { key, ttl = 30000 } = params.metadata;
      const lockKey = typeof key === 'function' ? key(...args) : key;

      let lock: Lock;
      try {
        lock = await this.redlockService.acquireLock(lockKey, ttl);
      } catch (error) {
        console.error(
          `키 ${lockKey}에 대한 락 획득 중 오류 발생: ${error.message}`,
        );
        throw new InternalServerErrorException(
          `키 ${lockKey}에 대한 락을 획득할 수 없습니다.`,
        );
      }

      try {
        return await params.method(...args);
      } finally {
        try {
          await lock.release();
          console.debug(`키 ${lockKey}에 대한 락이 해제되었습니다.`);
        } catch (err) {
          console.error(
            `키 ${lockKey}에 대한 락 해제 중 오류 발생: ${err.message}`,
          );
        }
      }
    };
  }
}
