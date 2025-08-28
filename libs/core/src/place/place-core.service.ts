import { UpdatePlaceInput } from './inputs/update-place.input';
import { CreatePlaceInput } from './inputs/create-place.input';
import { GetPlaceOverviewInput } from './inputs/get-place-overview.input';
import { PlaceOverviewModel } from './model/place-overview.model';
import { PlaceModel } from './model/place.model';
import { PlaceCoreRepository } from './place-core.repository';
import { Injectable, Logger } from '@nestjs/common';
import { BookmarkedPlaceOverviewModel } from './model/bookmarked-place-overview.model';
import { GetBookmarkedPlaceOverviewInput } from './inputs/get-bookmarked-place-overview.input';
import { GetPlaceMarkerInput } from './inputs/get-place-overview-marker.input';
import { PlaceMarkerModel } from './model/place-marker.model';
import { Transactional } from '@nestjs-cls/transactional';
import { DateUtilService } from '@libs/common/modules/date-util/date-util.service';
import { WeeklyCloseType } from './constants/weekly-close-type.constant';

/**
 * 장소 관련 핵심 서비스
 *
 * @publicApi
 */
@Injectable()
export class PlaceCoreService {
  constructor(
    private readonly placeCoreRepository: PlaceCoreRepository,
    private readonly dateUtilService: DateUtilService,
    private readonly logger: Logger,
  ) {}

  public async getPlaceByIdx(idx: number): Promise<PlaceModel | null> {
    const place = await this.placeCoreRepository.selectPlaceByIdx(idx);
    return place && PlaceModel.fromPrisma(place);
  }

  public async getPlaceOverviewCount(
    input: GetPlaceOverviewInput,
  ): Promise<number> {
    return await this.placeCoreRepository.selectPlaceCount(input);
  }

  public async getBookmarkedPlace(
    input: GetBookmarkedPlaceOverviewInput,
  ): Promise<BookmarkedPlaceOverviewModel[]> {
    return await this.placeCoreRepository
      .selectBookmarkedPlaceAll(input)
      .then((result) => result.map(BookmarkedPlaceOverviewModel.fromPrisma));
  }

  @Transactional()
  public async getPlaceAll(
    input: GetPlaceOverviewInput,
  ): Promise<PlaceOverviewModel[]> {
    if (input.operating === undefined) {
      const pageSize = input.take;
      const skip = input.skip;
      const baseFilter = {
        activated: input.activated,
        permanentlyClosed: input.permanentlyClosed,
        order: input.order,
        types: input.types,
        orderBy: input.orderBy,
        searchKeyword: input.searchKeyword,
        bookmarkUserIdx: input.bookmarkUserIdx,
      };

      const operatingPlaceCount =
        await this.placeCoreRepository.selectOperatingPlaceCount();

      const operatingRemain = Math.max(0, operatingPlaceCount - skip); // 운영중인 장소에서 남은 수
      const operatingTake = Math.max(0, Math.min(pageSize, operatingRemain)); // 실제로 가져올 운영중인 장소 수

      const closedSkip =
        skip <= operatingPlaceCount ? 0 : skip - operatingPlaceCount; // 폐점된 장소에서 건너뛸 수
      const closedTake = Math.max(0, pageSize - operatingTake); // 실제로 가져올 폐점된 장소 수

      const [operatingList, closedList] = await Promise.all([
        operatingTake > 0
          ? this.placeCoreRepository.selectPlaceAll({
              ...baseFilter,
              take: operatingTake + 1,
              skip: skip,
              operating: true,
            })
          : Promise.resolve([]),
        closedTake > 0
          ? this.placeCoreRepository.selectPlaceAll({
              ...baseFilter,
              take: closedTake + 1,
              skip: closedSkip,
              operating: false,
            })
          : Promise.resolve([]),
      ]);

      return [...operatingList, ...closedList].map(
        PlaceOverviewModel.fromPrisma,
      );
    }

    return (await this.placeCoreRepository.selectPlaceAll(input)).map(
      PlaceOverviewModel.fromPrisma,
    );
  }

  public async getPlaceMarkerAll(
    input: GetPlaceMarkerInput,
  ): Promise<PlaceMarkerModel[]> {
    return (await this.placeCoreRepository.selectPlaceMarkerAll(input)).map(
      PlaceMarkerModel.fromPrisma,
    );
  }

  public async getOperatingPlaceCount(): Promise<number> {
    return await this.placeCoreRepository.selectOperatingPlaceCount();
  }

  public async createPlace(input: CreatePlaceInput): Promise<PlaceModel> {
    return PlaceModel.fromPrisma(
      await this.placeCoreRepository.insertPlace(input),
    );
  }

  public async updatePlaceByIdx(
    idx: number,
    input: UpdatePlaceInput,
  ): Promise<void> {
    return await this.placeCoreRepository.updatePlaceByIdx(idx, input);
  }

  public async deletePlaceByIdx(idx: number): Promise<void> {
    return await this.placeCoreRepository.softDeletePlaceByIdx(idx);
  }

  public async increasePlaceReviewCount(idx: number): Promise<void> {
    return await this.placeCoreRepository.increasePlaceReviewCountByIdx(idx, 1);
  }

  public async decreasePlaceReviewCount(idx: number): Promise<void> {
    return await this.placeCoreRepository.decreasePlaceReviewCountByIdx(idx, 1);
  }

  public async increasePlaceBookmarkCount(idx: number): Promise<void> {
    return await this.placeCoreRepository.increasePlaceBookmarkCountByIdx(
      idx,
      1,
    );
  }

  public async decreasePlaceBookmarkCount(idx: number): Promise<void> {
    return await this.placeCoreRepository.decreasePlaceBookmarkCountByIdx(
      idx,
      1,
    );
  }

  public async increaseKeywordCount(
    placeIdx: number,
    keywordIdx: number,
  ): Promise<void> {
    return await this.placeCoreRepository.increaseKeywordCount(
      placeIdx,
      keywordIdx,
      1,
    );
  }

  public async decreaseKeywordCount(
    placeIdx: number,
    keywordIdx: number,
  ): Promise<void> {
    return await this.placeCoreRepository.decreaseKeywordCount(
      placeIdx,
      keywordIdx,
      1,
    );
  }

  public async getPlaceIdxAllByWeeklyClosedDay(
    today: string,
    afterTwoWeeks: string,
    type: number,
  ): Promise<{ idx: number }[]> {
    return await this.placeCoreRepository.selectPlaceIdxAllByWeeklyClosedDay(
      today,
      afterTwoWeeks,
      type,
    );
  }

  public async createWeeklyClosedDay(
    placeIdx: number,
    date: string,
    type: number,
  ): Promise<void> {
    return await this.placeCoreRepository.insertWeeklyClosedDayByPlaceIdx(
      placeIdx,
      date,
      type,
    );
  }

  // TODO : 순수하지 못함. 통계를 내는 로직이 표함되어 있음. 필요시 수정
  public async createAllBiWeeklyClosedDay(date: string): Promise<{
    successCount: number;
    failureCount: number;
    errorList: { placeIdx: number; errorMessage: string }[];
  }> {
    const result = {
      successCount: 0,
      failureCount: 0,
      errorList: [] as { placeIdx: number; errorMessage: string }[],
    };

    const { today, afterTwoWeeks } =
      this.dateUtilService.getTodayAndAfterTwoWeeks(date);

    const placeIdxList = await this.getPlaceIdxAllByWeeklyClosedDay(
      today,
      afterTwoWeeks,
      WeeklyCloseType.BIWEEKLY,
    );

    for (const place of placeIdxList) {
      try {
        await this.createWeeklyClosedDay(
          place.idx,
          afterTwoWeeks,
          WeeklyCloseType.BIWEEKLY,
        );
        result.successCount++;
      } catch (error) {
        result.failureCount++;
        result.errorList.push({
          placeIdx: place.idx,
          errorMessage: error.message,
        });
      }
    }

    return result;
  }
}
