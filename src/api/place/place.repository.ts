import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { PlaceOverviewSelectField } from './type/place-overview-select-field.type';
import { PlaceSelectField } from './type/place-select-field.type';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlaceRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 모든 place 개요 가져오기
   *
   * @author 강정연
   */
  async selectAllPlaceOverview(
    skip: number,
    take: number,
    orderByOption?:
      | Prisma.PlaceOrderByWithRelationInput
      | Prisma.PlaceOrderByWithRelationInput[],
    userIdx?: number,
  ): Promise<PlaceOverviewSelectField[]> {
    return await this.prisma.place.findMany({
      skip,
      take,
      where: {
        deletedAt: null,
      },
      orderBy: orderByOption,
      select: {
        idx: true,
        name: true,
        roadAddress: {
          select: {
            addressName: true,
            detailAddress: true,
          },
        },
        reviewCount: true,
        placeKeywordCountList: {
          take: 2,
          orderBy: [{ count: 'desc' }, { keyword: { idx: 'asc' } }],
          select: {
            count: true,
            keyword: {
              select: {
                content: true,
                idx: true,
              },
            },
          },
        },
        bookmarkList: userIdx
          ? { where: { userIdx }, select: { placeIdx: true } }
          : undefined,
        placeImageList: {
          orderBy: { idx: 'asc' },
          select: {
            path: true,
          },
        },
        placeTypeMappingList: {
          select: {
            placeType: {
              select: {
                idx: true,
                content: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * 특정 idx의 place 관련 모든 정보 가져오기
   *
   * @author 강정연
   */
  async selectPlaceByPlaceIdx(
    placeIdx: number,
    userIdx?: number,
  ): Promise<PlaceSelectField | null> {
    return await this.prisma.place.findFirst({
      where: {
        idx: placeIdx,
        deletedAt: null,
      },
      select: {
        idx: true,
        name: true,
        tel: true,
        roadAddress: {
          select: {
            addressName: true,
            detailAddress: true,
            addressX: true,
            addressY: true,
          },
        },
        createdAt: true,
        reviewCount: true,
        placeKeywordCountList: {
          take: 2,
          orderBy: [{ count: 'desc' }, { keyword: { idx: 'asc' } }],
          select: {
            count: true,
            keyword: {
              select: {
                content: true,
                idx: true,
              },
            },
          },
        },
        operatingDayList: {
          select: {
            day: true,
            operatingHourList: {
              select: {
                startAt: true,
                endAt: true,
                BreakTimeList: {
                  select: {
                    startAt: true,
                    endAt: true,
                  },
                },
              },
            },
          },
        },
        bookmarkList: userIdx
          ? { where: { userIdx }, select: { placeIdx: true } }
          : undefined,
        placeImageList: {
          orderBy: { idx: 'asc' },
          select: {
            path: true,
          },
        },
        placeTypeMappingList: {
          select: {
            placeType: {
              select: {
                idx: true,
                content: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * 특정 idx의 place review count 업데이트
   *
   * @author 강정연
   */
  async updatePlaceReviewCountByPlaceIdx(
    placeIdx: number,
    value: number,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const db = tx ?? this.prisma;
    await db.place.update({
      where: { idx: placeIdx },
      data: {
        reviewCount: {
          increment: value,
        },
      },
    });
  }
}
