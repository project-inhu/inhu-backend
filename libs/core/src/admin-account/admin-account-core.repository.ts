import { SelectAdminAccount } from '@libs/core/admin-account/model/prisma-type/select-admin-account';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminAccountCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectAdminById(id: string): Promise<SelectAdminAccount | null> {
    return await this.txHost.tx.adminAccount.findFirst({
      where: {
        id,
      },
    });
  }
}
