import { AdminAccountCoreRepository } from '@libs/core/admin-account/admin-account-core.repository';
import { AdminAccountModel } from '@libs/core/admin-account/model/admin-account.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminAccountCoreService {
  constructor(
    private readonly adminAccountCoreRepository: AdminAccountCoreRepository,
  ) {}

  public async getAdminAccountById(
    id: string,
  ): Promise<AdminAccountModel | null> {
    const account = await this.adminAccountCoreRepository.selectAdminById(id);

    return account && AdminAccountModel.fromPrisma(account);
  }
}
