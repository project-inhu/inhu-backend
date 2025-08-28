import { SELECT_PLACE, SelectPlace } from './model/prisma-type/select-place';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { GetPlaceOverviewInput } from './inputs/get-place-overview.input';
import { Prisma } from '@prisma/client';
import { PlaceType } from './constants/place-type.constant';
import {
  SELECT_PLACE_OVERVIEW,
  SelectPlaceOverview,
} from './model/prisma-type/select-place-overview';
import { CreatePlaceInput } from './inputs/create-place.input';
import { UpdatePlaceInput } from './inputs/update-place.input';
import { GetBookmarkedPlaceOverviewInput } from './inputs/get-bookmarked-place-overview.input';
import {
  SELECT_BOOKMARKED_PLACE_OVERVIEW,
  SelectBookmarkedPlaceOverview,
} from './model/prisma-type/select-bookmarked-place-overview';
import { DateUtilService } from '@libs/common/modules/date-util/date-util.service';
import {
  SELECT_PLACE_MARKER,
  SelectPlaceMarker,
} from './model/prisma-type/select-place-marker';
import { GetPlaceMarkerInput } from './inputs/get-place-overview-marker.input';
import { GetPlaceOverviewMarkerInput } from './inputs/get-place-overview-marker.input';
import { WeeklyCloseType } from './constants/weekly-close-type.constant';

@Injectable()
export class PlaceCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly dateUtilService: DateUtilService,
  ) {}

  public async selectPlaceByIdx(idx: number): Promise<SelectPlace | null> {
    const now = this.dateUtilService.getNow();
    const todayKst = this.dateUtilService.transformKoreanDate(now);
    const today = new Date(`${todayKst}T00:00:00Z`);

    return await this.txHost.tx.place.findUnique({
      ...SELECT_PLACE,
      select: {
        ...SELECT_PLACE.select,
        weeklyClosedDayList: {
          ...SELECT_PLACE.select.weeklyClosedDayList,
          where: { closedDate: { gte: today } },
        },
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectPlaceAll({
    take,
    skip,
    orderBy,
    order,
    operating,
    bookmarkUserIdx,
    types,
    activated,
    permanentlyClosed,
    searchKeyword,
  }: GetPlaceOverviewInput): Promise<SelectPlaceOverview[]> {
    const now = this.dateUtilService.getNow();
    const todayKst = this.dateUtilService.transformKoreanDate(now);
    const today = new Date(`${todayKst}T00:00:00Z`);

    return await this.txHost.tx.place.findMany({
      ...SELECT_PLACE_OVERVIEW,
      select: {
        ...SELECT_PLACE_OVERVIEW.select,
        weeklyClosedDayList: {
          ...SELECT_PLACE_OVERVIEW.select.weeklyClosedDayList,
          where: { closedDate: { gte: today } },
        },
      },
      where: {
        AND: [
          { deletedAt: null },
          this.getOperatingFilterWhereClause(operating), // 영업중 필터링
          this.getBookmarkFilterWhereClause(bookmarkUserIdx), // 북마크 필터링
          this.getTypesFilterWhereClause(types), // 타입 필터링
          this.getActivatedAtFilterWhereClause(activated), // 활성화 필터링
          this.getPermanentlyClosedFilterWhereClause(permanentlyClosed), // 폐점 여부 필터링
          this.getSearchKeywordWhereClause(searchKeyword), // 검색 키워드 필터링
        ],
      },
      orderBy: this.getOrderByClause({ order, orderBy }),
      take,
      skip,
    });
  }

  public async selectPlaceMarkerAll({
    orderBy,
    order,
    operating,
    types,
    activated,
    permanentlyClosed,
    searchKeyword,
    coordinate,
  }: GetPlaceMarkerInput): Promise<SelectPlaceMarker[]> {
    return await this.txHost.tx.place.findMany({
      ...SELECT_PLACE_MARKER,
      where: {
        AND: [
          { deletedAt: null },
          this.getOperatingFilterWhereClause(operating), // 영업중 필터링
          this.getTypesFilterWhereClause(types), // 타입 필터링
          this.getActivatedAtFilterWhereClause(activated), // 활성화 필터링
          this.getPermanentlyClosedFilterWhereClause(permanentlyClosed), // 폐점 여부 필터링
          this.getSearchKeywordWhereClause(searchKeyword), // 검색 키워드 필터링
          this.getCoordinateFilterWhereClause(coordinate), // 좌표 필터링
        ],
      },
      orderBy: this.getOrderByClause({ order, orderBy }),
    });
  }

  public async selectPlaceCount({
    take,
    skip,
    orderBy,
    order,
    operating,
    bookmarkUserIdx,
    types,
    activated,
    permanentlyClosed,
    searchKeyword,
  }: GetPlaceOverviewInput): Promise<number> {
    return await this.txHost.tx.place.count({
      where: {
        AND: [
          { deletedAt: null },
          this.getOperatingFilterWhereClause(operating), // 영업중 필터링
          this.getBookmarkFilterWhereClause(bookmarkUserIdx), // 북마크 필터링
          this.getTypesFilterWhereClause(types), // 타입 필터링
          this.getActivatedAtFilterWhereClause(activated), // 활성화 필터링
          this.getPermanentlyClosedFilterWhereClause(permanentlyClosed), // 폐점 여부 필터링
          this.getSearchKeywordWhereClause(searchKeyword), // 검색 키워드 필터링
        ],
      },
    });
  }

  public async selectOperatingPlaceCount(): Promise<number> {
    return await this.txHost.tx.place.count({
      where: {
        AND: [{ deletedAt: null }, this.getOperatingFilterWhereClause(true)],
      },
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

  /**
   * 검색 키워드
   */
  private getSearchKeywordWhereClause(
    searchKeyword?: string,
  ): Prisma.PlaceWhereInput {
    if (!searchKeyword) {
      return {};
    }

    const trimmedSearchKeyword = searchKeyword.trim();

    return {
      OR: [
        { name: { contains: trimmedSearchKeyword } },
        {
          menuList: {
            some: {
              OR: [
                {
                  name: { contains: trimmedSearchKeyword },
                },
                {
                  content: {
                    contains: trimmedSearchKeyword,
                  },
                },
              ],
            },
          },
        },
      ],
    };
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
    // ! 주의: startAt과 endAt은 한국 시간으로 저장됩니다. 따라서 now를 한국 시간으로 변환하여 필터링해야 합니다.
    const nowKoreanTime =
      '1970-01-01T' + this.dateUtilService.transformKoreanTime(now);
    const nowKoreanDate =
      this.dateUtilService.transformKoreanDate(now) + 'T00:00:00Z';

    const mustBeOpenWhereClause: Prisma.PlaceWhereInput = {
      AND: [
        // closed_day_tb 에 존재하지 않아야 함.
        { closedDayList: { none: { week: todayNthOfWeek, day: dayOfWeek } } },
        // 오늘 요일의 운영 시간이 존재해야하며 startAt <= now <= endAt
        {
          operatingHourList: {
            some: {
              day: dayOfWeek,
              startAt: { lte: nowKoreanTime },
              endAt: { gte: nowKoreanTime },
            },
          },
        },
        // 오늘 날짜의 휴무일이 존재하지 않아야 함.
        { weeklyClosedDayList: { none: { closedDate: nowKoreanDate } } },
        // 오늘 요일에 해당하는 브레이크 타임에 어떤 데이터도 없어야함.
        {
          breakTimeList: {
            none: {
              day: dayOfWeek,
              startAt: { lte: nowKoreanTime },
              endAt: { gte: nowKoreanTime },
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
  }: Pick<GetPlaceOverviewInput, 'order' | 'orderBy'>):
    | Prisma.PlaceOrderByWithRelationInput
    | Prisma.PlaceOrderByWithRelationInput[] {
    if (orderBy === 'time') {
      return {
        idx: order,
      };
    }

    return [
      {
        [orderBy === 'review' ? 'reviewCount' : 'bookmarkCount']: order,
      },
      {
        idx: 'desc',
      },
    ];
  }

  public async insertPlace(input: CreatePlaceInput): Promise<SelectPlace> {
    const createdRoadAddress = await this.txHost.tx.roadAddress.create({
      select: { idx: true },
      data: {
        addressName: input.roadAddress.name,
        detailAddress: input.roadAddress.detail,
        addressX: input.roadAddress.addressX,
        addressY: input.roadAddress.addressY,
      },
    });

    return await this.txHost.tx.place.create({
      ...SELECT_PLACE,
      data: {
        name: input.name,
        tel: input.tel,
        isClosedOnHoliday: input.isClosedOnHoliday,
        activatedAt: input.activatedAt,
        placeImageList: {
          createMany: {
            data: input.imgList.map((path) => ({ path })),
          },
        },
        roadAddressIdx: createdRoadAddress.idx,
        placeTypeMappingList: {
          create: {
            placeTypeIdx: input.type,
          },
        },
        permanentlyClosedAt: input.permanentlyClosedAt,
        closedDayList: {
          createMany: {
            data: input.closedDayList.map(({ day, week }) => ({ day, week })),
          },
        },
        operatingHourList: {
          createMany: {
            data: input.operatingHourList.map(({ startAt, endAt, day }) => ({
              // ! 주의: startAt과 endAt은 한국 시간으로 저장됩니다. 따라서 1970-01-01T00:00:00Z 형태로 변환하여 저장합니다.
              startAt: `1970-01-01T${startAt}Z`,
              endAt: `1970-01-01T${endAt}Z`,
              day,
            })),
          },
        },
        weeklyClosedDayList: {
          createMany: {
            data: input.weeklyClosedDayList.map(({ closedDate, type }) => ({
              // ! 주의: closedDate는 한국 날짜로 저장됩니다. 따라서 2025-07-22T00:00:00Z 형태로 변환하여 저장합니다.
              closedDate: `${closedDate}T00:00:00Z`,
              type,
            })),
          },
        },
        breakTimeList: {
          createMany: {
            data: input.breakTimeList.map(({ day, startAt, endAt }) => ({
              day,
              // ! 주의: startAt과 endAt은 한국 시간으로 저장됩니다. 따라서 1970-01-01T00:00:00Z 형태로 변환하여 저장합니다.
              startAt: `1970-01-01T${startAt}Z`,
              endAt: `1970-01-01T${endAt}Z`,
            })),
          },
        },
      },
    });
  }

  public async updatePlaceByIdx(
    idx: number,
    input: UpdatePlaceInput,
  ): Promise<void> {
    const place = await this.txHost.tx.place.findUniqueOrThrow({
      select: { roadAddress: true },
      where: { idx, deletedAt: null },
    });

    if (input.roadAddress !== undefined) {
      await this.txHost.tx.roadAddress.update({
        data: {
          addressName: input.roadAddress.name,
          detailAddress: input.roadAddress.detail,
          addressX: input.roadAddress.addressX,
          addressY: input.roadAddress.addressY,
        },
        where: {
          idx: place.roadAddress.idx,
        },
      });
    }

    await this.txHost.tx.place.update({
      data: {
        name: input.name,
        tel: input.tel,
        isClosedOnHoliday: input.isClosedOnHoliday,
        activatedAt: input.activatedAt,
        permanentlyClosedAt: input.permanentlyClosedAt,
        placeImageList: input.imgList
          ? {
              updateMany: {
                where: { deletedAt: null },
                data: {
                  deletedAt: new Date(),
                },
              },
              createMany: {
                data: input.imgList.map((path) => ({ path })),
              },
            }
          : undefined,
        placeTypeMappingList: input.type
          ? {
              deleteMany: {},
              create: { placeTypeIdx: input.type },
            }
          : undefined,

        // ! 주의: Date 관련한 필드들은 insertPlace 메서드 주석을 참고하여 변환해야합니다.
        closedDayList: input.closedDayList
          ? {
              deleteMany: {},
              createMany: {
                data: input.closedDayList.map(({ day, week }) => ({
                  day,
                  week,
                })),
              },
            }
          : undefined,
        operatingHourList: input.operatingHourList
          ? {
              deleteMany: {},
              createMany: {
                data: input.operatingHourList.map(
                  ({ startAt, endAt, day }) => ({
                    startAt: `1970-01-01T${startAt}Z`,
                    endAt: `1970-01-01T${endAt}Z`,
                    day,
                  }),
                ),
              },
            }
          : undefined,
        weeklyClosedDayList: input.weeklyClosedDayList
          ? {
              deleteMany: {
                closedDate: {
                  gte: new Date(
                    `${this.dateUtilService.transformKoreanDate(
                      this.dateUtilService.getNow(),
                    )}T00:00:00Z`,
                  ),
                },
                type: {
                  in: input.weeklyClosedDayList.map((date) => date.type),
                },
              },
              createMany: {
                data: input.weeklyClosedDayList.map(({ closedDate, type }) => ({
                  closedDate: new Date(`${closedDate}T00:00:00Z`),
                  type,
                })),
              },
            }
          : undefined,
        breakTimeList: input.breakTimeList
          ? {
              deleteMany: {},
              createMany: {
                data: input.breakTimeList.map(({ day, startAt, endAt }) => ({
                  day,
                  startAt: `1970-01-01T${startAt}Z`,
                  endAt: `1970-01-01T${endAt}Z`,
                })),
              },
            }
          : undefined,
      },
      where: { idx, deletedAt: null },
    });
  }

  public async softDeletePlaceByIdx(idx: number): Promise<void> {
    await this.txHost.tx.place.update({
      select: {
        roadAddressIdx: true,
      },
      where: { idx, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  public async increasePlaceReviewCountByIdx(
    idx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.place.update({
      data: {
        reviewCount: {
          increment: count,
        },
      },
      where: { idx, deletedAt: null },
    });
  }

  public async decreasePlaceReviewCountByIdx(
    idx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.place.update({
      data: {
        reviewCount: {
          decrement: count,
        },
      },
      where: { idx, deletedAt: null },
    });
  }

  public async increasePlaceBookmarkCountByIdx(
    idx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.place.update({
      data: {
        bookmarkCount: {
          increment: count,
        },
      },
      where: { idx, deletedAt: null },
    });
  }

  public async decreasePlaceBookmarkCountByIdx(
    idx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.place.update({
      data: {
        bookmarkCount: {
          decrement: count,
        },
      },
      where: { idx, deletedAt: null },
    });
  }

  public async selectBookmarkedPlaceAll({
    userIdx,
    activated,
    coordinate,
    types,
    order = 'desc',
    operating,
    permanentlyClosed,
    take,
    skip,
  }: GetBookmarkedPlaceOverviewInput): Promise<
    SelectBookmarkedPlaceOverview[]
  > {
    return await this.txHost.tx.bookmark.findMany({
      ...SELECT_BOOKMARKED_PLACE_OVERVIEW,
      where: {
        place: {
          AND: [
            { deletedAt: null },
            this.getOperatingFilterWhereClause(operating), // 영업중 필터링
            this.getBookmarkFilterWhereClause(userIdx), // 북마크 필터링
            this.getCoordinateFilterWhereClause(coordinate), // 좌표 필터링
            this.getTypesFilterWhereClause(types), // 타입 필터링
            this.getActivatedAtFilterWhereClause(activated), // 활성화 필터링
            this.getPermanentlyClosedFilterWhereClause(permanentlyClosed), // 폐점 여부 필터링
          ],
        },
      },
      orderBy: {
        // TODO: createdAt 에 인덱싱 필요
        createdAt: order,
      },
      take,
      skip,
    });
  }

  public async increaseKeywordCount(
    placeIdx: number,
    keywordIdx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.placeKeywordCount.upsert({
      where: {
        placeIdx_keywordIdx: {
          placeIdx,
          keywordIdx,
        },
      },
      create: {
        placeIdx,
        keywordIdx,
        count,
      },
      update: {
        count: {
          increment: count,
        },
      },
    });
  }

  public async decreaseKeywordCount(
    placeIdx: number,
    keywordIdx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.placeKeywordCount.update({
      data: {
        count: {
          decrement: count,
        },
      },
      where: {
        placeIdx_keywordIdx: {
          placeIdx,
          keywordIdx,
        },
      },
    });
  }
}
