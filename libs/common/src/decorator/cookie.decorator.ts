import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type CookieKeys = 'refreshToken';

export const Cookie = createParamDecorator(
  (data: CookieKeys, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies?.[data] ?? null;
  },
);
