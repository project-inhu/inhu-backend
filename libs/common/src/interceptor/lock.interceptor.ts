import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { RedlockService } from '../modules/red-lock/redlock.service';
import { LOCK_METADATA, LockOptions } from '../decorator/locker.decorator';

@Injectable()
export class LockInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly redlockService: RedlockService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // 1. 메타데이터 조회
    // Reflector를 사용하여 현재 실행되는 메서드(@Locker가 붙어있는)에서 락 옵션을 가져옴
    const lockOptions = this.reflector.get<LockOptions>(
      LOCK_METADATA,
      context.getHandler(),
    );
    if (!lockOptions) {
      return next.handle();
    }

    // 2. 락 키(Lock Key) 계산
    const { key } = lockOptions;
    const ttl = lockOptions.ttl ?? 30000;
    const args = context.getArgs();

    let lockKey: string;
    if (typeof key === 'function') {
      lockKey = key(...args);
    } else {
      lockKey = key;
    }

    // 3. 락 획득 시도
    let lock;
    try {
      lock = await this.redlockService.acquireLock(lockKey, ttl);
    } catch (error) {
      // 락 획득 과정에서 네트워크 오류 등 예외가 발생한 경우
      console.error(
        `키 ${lockKey}에 대한 락 획득 중 오류 발생: ${error.message}`,
      );
      throw new BadRequestException(
        `키 ${lockKey}에 대한 락을 획득할 수 없습니다.`,
      );
    }

    // 락 획득에 실패한 경우 (다른 프로세스가 이미 락을 점유 중인 경우)
    if (!lock) {
      console.warn(`키 ${lockKey}에 대한 락을 획득하지 못했습니다.`);
      throw new BadRequestException(
        `키 ${lockKey}에 대한 락을 획득할 수 없습니다.`,
      );
    }

    // 4. 원래 메서드 실행 및 락 해제 보장
    return next.handle().pipe(
      finalize(async () => {
        try {
          await lock.release();
          console.debug(`키 ${lockKey}에 대한 락이 해제되었습니다.`);
        } catch (err) {
          // 락 해제 과정에서 오류가 발생할 경우를 대비한 예외 처리
          console.error(
            `키 ${lockKey}에 대한 락 해제 중 오류 발생: ${err.message}`,
          );
        }
      }),
    );
  }
}
