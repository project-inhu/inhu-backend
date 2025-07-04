import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * X-Client-Type 헤더를 가져오는 데코레이터
 *
 * @author 이수인
 */
export const ClientType = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    console.log(request.headers);

    return request.headers['X-Client-Type'] || null;
  },
);
