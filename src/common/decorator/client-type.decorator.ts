import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * X-Client-Type 헤더를 가져오는 데코레이터
 *
 * @author 이수인
 */
export const ClientType = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['X-Client-Type'] || null;
  },
);
