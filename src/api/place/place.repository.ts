import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { PlaceOverviewSelectField } from './type/place-overview-select-field.type';
import { PlaceSelectField } from './type/place-select-field.type';

@Injectable()
export class PlaceRepository {
  constructor(private prisma: PrismaService) {}

  async selectAllPlaceOverview(
    page: number,
    userIdx: number,
  ): Promise<PlaceOverviewSelectField[]> {
    return await this.prisma.place.findMany({
      skip: (page - 1) * 10,
      take: 10,
      where: {
        deletedAt: null,
      },
      select: {
        idx: true,
        name: true,
        address: true,
        bookmark: userIdx
          ? { where: { userIdx }, select: { idx: true } }
          : undefined,
        placeImage: {
          select: {
            path: true,
          },
        },
        review: {
          select: {
            idx: true,
          },
        },
      },
    });
  }

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
        address: true,
        addressX: true,
        addressY: true,
        createdAt: true,
        placeHours: {
          select: {
            day: true,
            startAt: true,
            endAt: true,
          },
        },
        bookmark: userIdx
          ? { where: { userIdx }, select: { idx: true } }
          : undefined,
        placeImage: {
          select: {
            path: true,
          },
        },
        review: {
          select: {
            idx: true,
          },
        },
      },
    });
  }
}
