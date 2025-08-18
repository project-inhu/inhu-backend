import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminLoginAuthGuard } from '../../api/auth/admin-login-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Exception } from '@libs/common/decorator/exception.decorator';

export const AdminAuth = () => {
  return applyDecorators(
    UseGuards(AdminLoginAuthGuard),
    ApiBearerAuth(),
    Exception(401, 'token not provided or expired'),
  );
};
