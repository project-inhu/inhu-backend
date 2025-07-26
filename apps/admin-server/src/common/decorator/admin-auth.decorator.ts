import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminLoginAuthGuard } from '../../api/auth/admin-login-auth.guard';
import { Exception } from '@libs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export const AdminAuth = () => {
  return applyDecorators(
    UseGuards(AdminLoginAuthGuard),
    ApiBearerAuth(),
    Exception(401, 'token not provided or expired'),
  );
};
