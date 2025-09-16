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
   * 현재 활성화된 배너 개수 조회
   */
  public async getActiveBannerCount(): Promise<number> {
    return await this.txHost.tx.banner.count({
      where: {
        deletedAt: null,
        activatedAt: { not: null },
      },
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
   * 활성 배너 sortOrder 이동
   * +1 : 뒤로 밀기
   * -1 : 앞으로 당기기
   */
  public async updateManyBannerSortOrder(
    increment: number,
    compare?: 'gt' | 'gte',
    comparisonValue?: number,
    compare2?: 'lt' | 'lte',
    comparisonValue2?: number,
  ): Promise<void> {
    const sortOrder: Record<string, number> = {};
    if (compare && comparisonValue !== undefined)
      sortOrder[compare] = comparisonValue;
    if (compare2 && comparisonValue2 !== undefined)
      sortOrder[compare2] = comparisonValue2;

    await this.txHost.tx.banner.updateMany({
      data: {
        sortOrder: {
          increment,
        },
      },
      where: {
        sortOrder,
        deletedAt: null,
        activatedAt: { not: null },
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
