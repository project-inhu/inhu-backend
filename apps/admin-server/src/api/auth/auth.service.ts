import { UserCoreService } from '@libs/core';
import { AdminAccountCoreService } from '@libs/core/admin-account/admin-account-core.service';
import { Injectable } from '@nestjs/common';
import { InvalidIdOrPwException } from 'apps/admin-server/src/api/auth/exception/invalid-id-or-pw.exception';
import { HashService } from 'apps/admin-server/src/common/modules/hash/hash.service';
import { LoginTokenService } from 'apps/admin-server/src/common/modules/login-token/login-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly loginTokenService: LoginTokenService,
    private readonly adminAccountCoreService: AdminAccountCoreService,
  ) {}

  public async login(id: string, pw: string): Promise<string> {
    const adminAccount =
      await this.adminAccountCoreService.getAdminAccountById(id);

    if (!adminAccount) {
      throw new InvalidIdOrPwException('Invalid ID or password');
    }

    const isPasswordValid = await this.hashService.compare(pw, adminAccount.pw);

    if (!isPasswordValid) {
      throw new InvalidIdOrPwException('Invalid ID or password');
    }

    const token = await this.loginTokenService.generateAdminToken(
      adminAccount.idx,
    );

    return token;
  }
}
