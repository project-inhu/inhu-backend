import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoginUser } from '@user/common/types/LoginUser';

/**
 * access token 에서 decode 한 사용자 정보를 가져오는 데코레이터
 */
export const User = createParamDecorator(
  (data: never, ctx: ExecutionContext): LoginUser => {
    const request = ctx.switchToHttp().getRequest();

    return {
      idx: request.user?.idx,
    };
  },
);
