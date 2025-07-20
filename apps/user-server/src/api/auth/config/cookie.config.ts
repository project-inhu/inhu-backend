import { getMode } from '@user/common/utils/get-mode.util';
import { CookieOptions } from 'express';

export default (): CookieOptions => {
  const mode = getMode();

  if (mode === 'development') {
    return {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    };
  }

  return {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  };
};
