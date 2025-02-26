/**
 * 인증된 요청에서 'user' 객체를 사용할 수 있도록 정의
 * RequestWithUser가 반드시 Express의 Request 형식을 따르도록 함
 *
 * @author 조희주
 */

import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: { idx: number };
}
