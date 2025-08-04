import { CookieOptions } from 'express';

export default (): CookieOptions => {
  // TODO: 배포 환경에서 쿠키 도메인을 설정하여 더욱 안전하게 관리할 수 있도록 해야함.
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };
};
