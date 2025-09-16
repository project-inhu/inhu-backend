import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { SELECT_BANNER, SelectBanner } from './model/prisma-type/select-banner';
import { CreateBannerInput } from './inputs/create-banner.input';
import { UpdateBannerInput } from './inputs/update-banner.input';
import { Prisma } from '@prisma/client';
import { GetBannerAllInput } from './inputs/get-banner-all.input';

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

  public async selectBannerAll({
    take,
    skip,
    orderBy,
    order,
    activated,
  }: GetBannerAllInput): Promise<SelectBanner[]> {
    return await this.txHost.tx.banner.findMany({
      ...SELECT_BANNER,
      where: {
        AND: [
          { deletedAt: null },
          this.getActivatedAtFilterWhereClause(activated),
        ],
      },
      orderBy: this.getOrderByClause({ orderBy, order }),
      take,
      skip,
    });
  }

  /**
   * 활성화 여부 필터링
   */
  private getActivatedAtFilterWhereClause(
    activated?: boolean,
  ): Prisma.BannerWhereInput {
    if (activated === undefined) {
      return {};
    }

    if (activated) {
      return { activatedAt: { not: null } };
    }

    return { activatedAt: null };
  }

  /**
   * 정렬 조건
   * - 전체 탭: 최신순 (createdAt desc 기본)
   * - 활성화 탭: sortOrder asc 기본
   */
  private getOrderByClause({
    orderBy = 'time',
    order = 'desc',
  }: Pick<
    GetBannerAllInput,
    'orderBy' | 'order'
  >): Prisma.BannerOrderByWithRelationInput {
    if (orderBy === 'time') {
      return { idx: order };
    }

    if (orderBy === 'sortOrder') {
      return { sortOrder: order };
    }

    return { idx: 'desc' };
  }

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
        activatedAt: input.activatedAt,
      },
    });
  }
}
