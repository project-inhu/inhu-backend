import { applyDecorators, UseGuards } from '@nestjs/common';
import { TokenIssuedBy } from '@user/common/module/login-token/constants/token-issued-by.constants';
import { AppLoginAuthGuard } from '@user/api/auth/app-login-auth.guard';
import { LoginAuthGuard } from '@user/api/auth/login-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Exception } from '@libs/common/decorator/exception.decorator';

export const LoginAuth = (issuedBy: TokenIssuedBy = TokenIssuedBy.WEB) => {
  if (issuedBy === TokenIssuedBy.APP) {
    return applyDecorators(
      UseGuards(AppLoginAuthGuard),
      ApiBearerAuth(),
      Exception(401, 'token not provided or expired'),
      Exception(403, 'Access denied'),
    );
  }

  return applyDecorators(
    UseGuards(LoginAuthGuard),
    ApiBearerAuth(),
    Exception(401, 'token not provided or expired'),
  );
};
