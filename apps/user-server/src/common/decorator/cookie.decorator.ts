import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type AllowCookieKeys = 'refreshToken';

/**
 * access token 에서 decode 한 사용자 정보를 가져오는 데코레이터
 *
 * @author 이수인
 *
 * @deprecated 대신, @lib/common 에 `Cookie`를 사용하십시오.
 */
export const Cookie = createParamDecorator(
  (data: AllowCookieKeys, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies?.[data] ?? null;
  },
);
