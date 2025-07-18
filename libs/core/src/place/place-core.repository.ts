import { SelectPlace } from './model/prisma-type/select-place';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { GetPlaceOverviewInput } from './inputs/get-place-overview.input';
import { DateUtilService } from '@app/common';
import { Prisma } from '@prisma/client';
import { PlaceType } from './constants/place-type.constant';
import { SelectPlaceOverview } from './model/prisma-type/select-place-overview';

@Injectable()
export class PlaceCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly dateUtilService: DateUtilService,
  ) {}

  public async selectPlaceByIdx(idx: number): Promise<SelectPlace | null> {
    return await this.txHost.tx.place.findUnique({
      select: {
        idx: true,
        name: true,
        tel: true,
        reviewCount: true,
        bookmarkCount: true,
        activatedAt: true,
        isClosedOnHoliday: true,
        createdAt: true,
        permanentlyClosedAt: true,
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

  public async selectPlaceAll({
    operating,
    bookmarkUserIdx,
    coordinate,
    types,
    skip,
    take,
    order,
    orderBy,
    activated,
    permanentlyClosed,
  }: GetPlaceOverviewInput): Promise<SelectPlaceOverview[]> {
    return await this.txHost.tx.place.findMany({
      select: {
        idx: true,
        name: true,
        tel: true,
        reviewCount: true,
        bookmarkCount: true,
        activatedAt: true,
        isClosedOnHoliday: true,
        createdAt: true,
        permanentlyClosedAt: true,
        placeImageList: {
          select: { path: true },
          where: { deletedAt: null },
          orderBy: { idx: 'asc' },
        },
      },
      where: {
        AND: [
          { deletedAt: null },
          this.getOperatingFilterWhereClause(operating), // 영업중 필터링
          this.getBookmarkFilterWhereClause(bookmarkUserIdx), // 북마크 필터링
          this.getCoordinateFilterWhereClause(coordinate), // 좌표 필터링
          this.getTypesFilterWhereClause(types), // 타입 필터링
          this.getActivatedAtFilterWhereClause(activated), // 활성화 필터링
          this.getPermanentlyClosedFilterWhereClause(permanentlyClosed), // 폐점 여부 필터링
        ],
      },
      orderBy: this.getOrderByClause({ order, orderBy }),
      take,
      skip,
    });
  }

  /**
   * 폐점 여부 필터링
   */
  private getPermanentlyClosedFilterWhereClause(
    permanentlyClosed?: boolean,
  ): Prisma.PlaceWhereInput {
    if (permanentlyClosed === undefined) {
      return {};
    }

    if (permanentlyClosed) {
      return { permanentlyClosedAt: { not: null } };
    }

    return { permanentlyClosedAt: null };
  }

  private getOperatingFilterWhereClause(
    operating?: boolean,
  ): Prisma.PlaceWhereInput {
    if (operating === undefined) {
      return {};
    }

    const now = this.dateUtilService.getNow();

    // 오늘 요일이 이번 달의 몇 번째 주인지
    const todayNthOfWeek = this.dateUtilService.getTodayNthDayOfWeekInMonth();

    // 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
    const dayOfWeek = this.dateUtilService.getTodayDayOfWeek();

    const mustBeOpenWhereClause: Prisma.PlaceWhereInput = {
      AND: [
        // closed_day_tb 에 존재하지 않아야 함.
        { closedDayList: { none: { week: todayNthOfWeek, day: dayOfWeek } } },
        // 오늘 요일의 운영 시간이 존재해야하며 startAt <= now <= endAt
        {
          operatingHourList: {
            some: {
              day: dayOfWeek,
              startAt: { lte: now },
              endAt: { gte: now },
            },
          },
        },
        // 오늘 날짜의 휴무일이 존재하지 않아야 함.
        { weeklyClosedDayList: { none: { closedDate: now } } },
        // 오늘 요일에 해당하는 브레이크 타임에 어떤 데이터도 없어야함.
        {
          breakTimeList: {
            none: {
              day: dayOfWeek,
              startAt: { lte: now },
              endAt: { gte: now },
            },
          },
        },
      ],
    };

    if (operating) {
      return mustBeOpenWhereClause;
    }

    return { NOT: mustBeOpenWhereClause };
  }

  private getBookmarkFilterWhereClause(
    bookmarkUserIdx?: number,
  ): Prisma.PlaceWhereInput {
    if (bookmarkUserIdx === undefined) {
      return {};
    }

    return { bookmarkList: { some: { userIdx: bookmarkUserIdx } } };
  }

  private getCoordinateFilterWhereClause(coordinate?: {
    leftTopX: number;
    leftTopY: number;
    rightBottomX: number;
    rightBottomY: number;
  }): Prisma.PlaceWhereInput {
    if (coordinate === undefined) {
      return {};
    }

    return {
      roadAddress: {
        addressX: { gte: coordinate.leftTopX, lte: coordinate.rightBottomX },
        addressY: { gte: coordinate.rightBottomY, lte: coordinate.leftTopY },
      },
    };
  }

  private getTypesFilterWhereClause(
    types?: PlaceType[],
  ): Prisma.PlaceWhereInput {
    if (types === undefined || types.length === 0) {
      return {};
    }

    return { placeTypeMappingList: { some: { placeTypeIdx: { in: types } } } };
  }

  private getActivatedAtFilterWhereClause(
    activated?: boolean,
  ): Prisma.PlaceWhereInput {
    if (activated === undefined) {
      return {};
    }

    if (activated) {
      return { activatedAt: { not: null } };
    }

    return { activatedAt: null };
  }

  private getOrderByClause({
    order = 'desc',
    orderBy = 'time',
  }: Pick<
    GetPlaceOverviewInput,
    'order' | 'orderBy'
  >): Prisma.PlaceOrderByWithRelationInput {
    return {
      [orderBy === 'time'
        ? 'idx'
        : orderBy === 'review'
          ? 'reviewCount'
          : 'bookmarkCount']: order,
    };
  }
}
