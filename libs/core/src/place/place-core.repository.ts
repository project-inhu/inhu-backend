import { SelectPlace } from './model/prisma-type/select-place';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlaceCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectPlaceByIdx(idx: number): Promise<SelectPlace | null> {
    return await this.txHost.tx.place.findUnique({
      select: {
        idx: true,
        name: true,
        tel: true,
        reviewCount: true,
        bookmarkCount: true,
        isClosedOnHoliday: true,
        createdAt: true,
        closedAt: true,
        roadAddress: {
          select: {
            idx: true,
            addressName: true,
            detailAddress: true,
            addressX: true,
            addressY: true,
          },
        },
        placeImageList: {
          select: { path: true },
          where: { deletedAt: null },
          orderBy: { idx: 'asc' },
        },
        placeTypeMappingList: {
          select: {
            placeTypeIdx: true,
          },
        },
        closedDayList: {
          select: {
            idx: true,
            day: true,
            week: true,
          },
        },
        operatingHourList: {
          select: {
            idx: true,
            day: true,
            startAt: true,
            endAt: true,
          },
        },
        weeklyClosedDayList: {
          select: {
            idx: true,
            closedDate: true,
            type: true,
          },
        },
        breakTimeList: {
          select: {
            idx: true,
            day: true,
            startAt: true,
            endAt: true,
          },
        },
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }
}
