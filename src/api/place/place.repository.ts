import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { PlaceOverviewSelectField } from './type/place-overview-select-field.type';
import { PlaceSelectField } from './type/place-select-field.type';
import { Prisma } from '@prisma/client';

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
        reviewCount: true,
        bookmarkList: userIdx
          ? { where: { userIdx }, select: { idx: true } }
          : undefined,
        placeImageList: {
          select: {
            path: true,
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
        reviewCount: true,
        placeDayList: {
          select: {
            day: true,
            placeHourList: {
              select: {
                startAt: true,
                endAt: true,
                placeBreakTimeList: {
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
          ? { where: { userIdx }, select: { idx: true } }
          : undefined,
        placeImageList: {
          select: {
            path: true,
          },
        },
      },
    });
  }

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
