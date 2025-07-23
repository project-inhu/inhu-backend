import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminLoginAuthGuard } from '../../api/auth/admin-login-auth.guard';
import { Exception } from '@libs/common';

export const AdminAuth = () => {
  return applyDecorators(
    UseGuards(AdminLoginAuthGuard),
    Exception(401, 'token not provided or expired'),
    Exception(403, 'Access denied'),
  );
};
