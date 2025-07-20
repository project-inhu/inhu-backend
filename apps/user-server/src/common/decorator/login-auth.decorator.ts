import { applyDecorators, UseGuards } from '@nestjs/common';
import { TokenIssuedBy } from '@user/common/module/login-token/constants/token-issued-by.constants';
import { Exception } from '@libs/common';
import { AppLoginAuthGuard } from '@user/api/auth/app-login-auth.guard';
import { LoginAuthGuard } from '@user/api/auth/login-auth.guard';

export const LoginAuth = (issuedBy: TokenIssuedBy = TokenIssuedBy.WEB) => {
  if (issuedBy === TokenIssuedBy.APP) {
    return applyDecorators(
      UseGuards(AppLoginAuthGuard),
      Exception(401, 'token not provided or expired'),
      Exception(403, 'Access denied'),
    );
  }

  return applyDecorators(
    UseGuards(LoginAuthGuard),
    Exception(401, 'token not provided or expired'),
  );
};
