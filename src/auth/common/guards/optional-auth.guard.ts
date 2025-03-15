import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

export class OptionalAuthGuard extends AuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.cookies?.accessToken) {
      return true;
    }

    return await super.canActivate(context);
  }
}
