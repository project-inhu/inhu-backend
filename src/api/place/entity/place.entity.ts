import { OperatingWeekDay } from '../type/operating-week-day.type';
import { Decimal } from '@prisma/client/runtime/library';
import { WEEKS } from '../common/constants/weeks.constant';
import { PlaceSelectField } from '../type/place-select-field.type';
import { OperatingWeekSchedule } from '../type/operating-week-schedule.type';
import { OperatingTimeInfo } from '../type/operating-time-info.type';
import { formatTimeFromDate } from 'src/common/utils/date.util';
import { KeywordEntity } from 'src/api/keyword/entity/keyword.entity';
import { PickType } from '@nestjs/swagger';

class PlaceKeywordEntity extends PickType(KeywordEntity, ['idx', 'content']) {}

export class PlaceEntity {
  /**
   * place Idx
   *
   * @example 1
   */
  idx: number;

  /**
   * place name
   *
   * @example '동아리 닭갈비'
   */
  name: string;

  /**
   * place tel
   *
   * @example '032-1111-2222'
   */
  tel: string | null;

  /**
   * place address
   *
   * @example '인천 미추홀구'
   */
  address: string;

  /**
   * place addressX
   *
   * @example 37.1111
   */
  addressX: Decimal;

  /**
   * place addressY
   *
   * @example 37.1111
   */
  addressY: Decimal;

  /**
   * 생성 날짜
   */
  createdAt: Date;

  /**
   * 요일별 운영 시간 및 브레이크타임 정보
   */
  week: OperatingWeekSchedule;

  /**
   * review count
   *
   * @example 1
   */
  reviewCount: number;

  /**
   * 현재 사용자가 특정 항목을 북마크했는지 여부
   */
  bookmark: boolean;

  /**
   * 특정 장소에서 가장 많이 사용된 review keyword 상위 2개
   *
   * @example ['맛있어요.', '가성비 좋아요.']
   */
  keywordList: PlaceKeywordEntity[];

  /**
   * 특정 장소 image path list
   *
   * @example ['place/f9c2e36f-8e99-4b18-b3e8-7cd327682f94_20240706_124512.jpg']
   */
  imagePathList: string[];

  constructor(data: PlaceEntity) {
    Object.assign(this, data);
  }

  static createEntityFromPrisma(place: PlaceSelectField): PlaceEntity {
    return new PlaceEntity({
      idx: place.idx,
      name: place.name,
      tel: place.tel,
      address: place.address,
      addressX: place.addressX,
      addressY: place.addressY,
      createdAt: place.createdAt,
      week: place.operatingDayList.reduce<OperatingWeekSchedule>(
        (acc, item) => {
          const key = item.day as OperatingWeekDay;
          const timeList: OperatingTimeInfo[] = item.operatingHourList.map(
            (hour) => ({
              startAt: formatTimeFromDate(hour.startAt),
              endAt: formatTimeFromDate(hour.endAt),
              breakTimeList: hour.BreakTimeList.map((bt) => ({
                startAt: formatTimeFromDate(bt.startAt),
                endAt: formatTimeFromDate(bt.endAt),
              })),
            }),
          );
          acc[key] = timeList.length > 0 ? timeList : [];
          return acc;
        },
        {
          [WEEKS.MON]: null,
          [WEEKS.TUE]: null,
          [WEEKS.WED]: null,
          [WEEKS.THU]: null,
          [WEEKS.FRI]: null,
          [WEEKS.SAT]: null,
          [WEEKS.SUN]: null,
        },
      ),
      reviewCount: place.reviewCount,
      bookmark: place.bookmarkList?.length ? true : false,
      keywordList: place.placeKeywordCountList.map(({ keyword }) => ({
        idx: keyword.idx,
        content: keyword.content,
      })),
      imagePathList: place.placeImageList.map((image) => image.path ?? ''),
    });
  }
}
