import { Injectable } from '@nestjs/common';
import { PlaceOverviewSelectField } from './type/place-overview-select-field.type';
import { PlaceSelectField } from './type/place-select-field.type';
import { Prisma } from '@prisma/client';
import { DateUtilService } from '@user/common/module/date-util/date-util.service';
import { SelectPlaceOverviewInput } from '@user/api/place/input/select-place-overview.input';
import { PlaceType } from '@user/api/place/constants/place-type.constant';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class PlaceRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly dateUtilService: DateUtilService,
  ) {}

  /**
   * 모든 place 개요 가져오기
   *
   * @author 강정연
   */
  async selectAllPlaceOverview({
    order = 'desc',
    orderBy = 'time',
    readUserIdx,
    operating,
    take,
    skip,
    bookmarkUserIdx,
    coordinate,
    types,
  }: SelectPlaceOverviewInput): Promise<PlaceOverviewSelectField[]> {
    return await this.txHost.tx.place.findMany({
      select: {
        idx: true,
        name: true,
        roadAddress: { select: { addressName: true, detailAddress: true } },
        reviewCount: true,
        placeKeywordCountList: {
          take: 2,
          orderBy: [{ count: 'desc' }, { keyword: { idx: 'asc' } }],
          select: {
            count: true,
            keyword: { select: { content: true, idx: true } },
          },
        },
        bookmarkList: readUserIdx
          ? { where: { userIdx: readUserIdx }, select: { placeIdx: true } }
          : undefined,
        placeImageList: { orderBy: { idx: 'asc' }, select: { path: true } },
        placeTypeMappingList: {
          select: { placeType: { select: { idx: true, content: true } } },
        },
      },
      where: {
        AND: [
          { deletedAt: null },
          this.getOperatingFilterWhereClause(operating), // 영업중 필터링
          this.getBookmarkFilterWhereClause(bookmarkUserIdx), // 북마크 필터링
          this.getCoordinateFilterWhereClause(coordinate), // 좌표 필터링
          this.getTypesFilterWhereClause(types), // 타입 필터링
        ],
      },
      orderBy: { [orderBy === 'time' ? 'idx' : 'reviewCount']: order },
      skip,
      take,
    });
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

  /**
   * 특정 idx의 place 관련 모든 정보 가져오기
   *
   * @author 강정연
   */
  async selectPlaceByPlaceIdx(
    placeIdx: number,
    userIdx?: number,
  ): Promise<PlaceSelectField | null> {
    return await this.txHost.tx.place.findFirst({
      where: { idx: placeIdx, deletedAt: null },
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
        isClosedOnHoliday: true,
        placeKeywordCountList: {
          take: 2,
          orderBy: [{ count: 'desc' }, { keyword: { idx: 'asc' } }],
          select: {
            count: true,
            keyword: { select: { content: true, idx: true } },
          },
        },
        operatingHourList: {
          orderBy: [{ day: 'asc' }, { startAt: 'asc' }],
          select: { day: true, startAt: true, endAt: true },
        },
        breakTimeList: {
          orderBy: [{ day: 'asc' }, { startAt: 'asc' }],
          select: { day: true, startAt: true, endAt: true },
        },
        closedDayList: { select: { day: true, week: true } },
        weeklyClosedDayList: { select: { closedDate: true, type: true } },
        bookmarkList: userIdx
          ? { where: { userIdx }, select: { placeIdx: true } }
          : undefined,
        placeImageList: { orderBy: { idx: 'asc' }, select: { path: true } },
        placeTypeMappingList: {
          select: { placeType: { select: { idx: true, content: true } } },
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
  ): Promise<void> {
    await this.txHost.tx.place.update({
      where: { idx: placeIdx },
      data: { reviewCount: { increment: value } },
    });
  }
}
