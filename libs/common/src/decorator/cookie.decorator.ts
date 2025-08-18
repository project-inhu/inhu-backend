import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type CookieKeys = 'refreshToken';

/**
 * 쿠키에서 특정 키의 값을 가져오는 데코레이터입니다.
 *
 * @publicApi
 */
export const Cookie = createParamDecorator(
  (data: CookieKeys, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies?.[data] ?? null;
  },
);
