import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { SELECT_BANNER, SelectBanner } from './model/prisma-type/select-banner';
import { CreateBannerInput } from './inputs/create-banner.input';
import { UpdateBannerInput } from './inputs/update-banner.input';

@Injectable()
export class BannerCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectBannerByIdx(idx: number): Promise<SelectBanner | null> {
    return await this.txHost.tx.banner.findUnique({
      ...SELECT_BANNER,
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  // public async selectBannerAll({ skip, take, activated }) {
  //   return await this.txHost.tx.banner.findMany({
  //     ...SELECT_BANNER,
  //     where: {
  //       AND: [
  //         { deletedAt: null },
  //         this.getActivatedAtFilterWhereClause(activated),
  //       ],
  //     },
  //   });
  // }

  // private getActivatedAtFilterWhereClause(
  //   activated?: boolean,
  // ): Prisma.BannerWhereInput {
  //   if (activated === undefined) {
  //     return {};
  //   }

  //   if (activated) {
  //     return { activatedAt: { not: null } };
  //   }

  //   return { activatedAt: null };
  // }

  /**
   * 배너 생성
   * - 비활성 상태로 생성됨
   * - 관리자가 활성화할 때 sortOrder가 부여됨
   */
  public async insertBanner(input: CreateBannerInput): Promise<SelectBanner> {
    return await this.txHost.tx.banner.create({
      ...SELECT_BANNER,
      data: {
        ...input,
        sortOrder: null,
      },
    });
  }

  /**
   * 배너 soft delete
   */
  public async softDeleteBannerByIdx(idx: number): Promise<void> {
    await this.txHost.tx.banner.update({
      where: { idx },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * 현재 활성화된 배너들 중 가장 큰 sortOrder를 가져옴
   * - 신규 활성화 시, 그 뒤에 붙이기 위해 사용
   */
  public async selectLastActive(): Promise<SelectBanner | null> {
    return await this.txHost.tx.banner.findFirst({
      where: { deletedAt: null, sortOrder: { not: null } },
      orderBy: { sortOrder: 'desc' },
    });
  }

  /**
   * sortOrder 업데이트
   */
  public async updateSortOrderByIdx(
    idx: number,
    sortOrder: number | null,
  ): Promise<void> {
    await this.txHost.tx.banner.update({
      where: { idx, deletedAt: null },
      data: { sortOrder },
    });
  }

  /**
   * 특정 sortOrder보다 뒤에 있는 순서를 앞으로 당김
   */
  public async decrementSortOrder(sortOrder: number): Promise<void> {
    await this.txHost.tx.banner.updateMany({
      where: {
        deletedAt: null,
        sortOrder: { gt: sortOrder },
      },
      data: {
        sortOrder: { decrement: 1 },
      },
    });
  }

  /**
   * 배너 수정
   */
  public async updateBannerByIdx(
    idx: number,
    input: UpdateBannerInput,
  ): Promise<void> {
    await this.txHost.tx.banner.update({
      where: { idx, deletedAt: null },
      data: {
        name: input.name,
        imagePath: input.imagePath,
        link: input.link,
        startAt: input.startAt,
        endAt: input.endAt,
        activatedAt: input.activatedAt,
      },
    });
  }
}
