import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { LockInterceptor } from '../interceptor/lock.interceptor';

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

// 메타데이터를 저장하고 조회할 때 사용할 고유한 키
export const LOCK_METADATA = 'LOCK_METADATA';

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
 *   @Locker({ key: (req: Request) => `place:like:${req.params.placeId}:${req.user.id}:${req.body.categoryIdx}`, ttl: 1000 * 30 })
 */
export const Locker = (options: LockOptions) =>
  applyDecorators(
    SetMetadata(LOCK_METADATA, options),
    UseInterceptors(LockInterceptor),
  );
