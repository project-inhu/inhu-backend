import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { PickedPlaceOverviewSelectField } from './type/picked-place-overview-select-field';

@Injectable()
export class PickedPlaceRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 선정된 장소 개요 (Picked Place) 모두 가져오기
   *
   * @author 강정연
   */
  async selectAllPickedPlaceOverview(
    skip: number,
    take: number,
    userIdx?: number,
  ): Promise<PickedPlaceOverviewSelectField[]> {
    return await this.prisma.pickedPlace.findMany({
      skip,
      take,
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        title: true,
        content: true,
        place: {
          select: {
            idx: true,
            name: true,
            address: true,
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
              ? {
                  where: { userIdx },
                  select: { placeIdx: true },
                }
              : undefined,
            placeImageList: {
              orderBy: { idx: 'asc' },
              select: {
                path: true,
              },
            },
          },
        },
      },
    });
  }
}
