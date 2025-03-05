import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 로그인된 사용자 정보를 가져오는 데코레이터
 * @author 조희주
 */
export const LoginUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
