import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * access token 에서 decode 한 사용자 정보를 가져오는 데코레이터
 *
 * @author 이수인
 */
export const Cookie = createParamDecorator(
  (data: keyof CookieData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies?.[data] ?? null;
  },
);
