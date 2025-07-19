import { PrismaTestingHelper } from '@chax-at/transactional-prisma-testing';
import { PrismaService } from '@libs/common/modules/prisma/prisma.service';

export class PrismaTestSetup {
  private readonly prisma: PrismaService;
  private readonly prismaTestingHelper: PrismaTestingHelper<PrismaService>;

  private constructor() {
    if (this.prismaTestingHelper) {
      return;
    }

    this.prisma = new PrismaService();
    this.prismaTestingHelper = new PrismaTestingHelper(this.prisma);
    this.prisma = this.prismaTestingHelper.getProxyClient();
  }

  public async BEGIN() {
    await this.prismaTestingHelper.startNewTransaction();
  }

  public ROLLBACK() {
    this.prismaTestingHelper.rollbackCurrentTransaction();
  }

  public getPrisma() {
    return this.prisma;
  }

  static setup() {
    return new PrismaTestSetup();
  }
}
