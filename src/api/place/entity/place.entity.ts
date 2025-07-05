import { PlaceWeekDay } from '../type/place-week-day.type';
import { Decimal } from '@prisma/client/runtime/library';
import { WEEKS } from '../common/constants/weeks.constant';
import { PlaceSelectField } from '../type/place-select-field.type';
import { PlaceWeekSchedule } from '../type/place-week-schedule.type';
import { PlaceWeekInfo } from '../type/place-week-info.type';

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
  week: PlaceWeekSchedule;

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
  keywordList: string[];

  /**
   * 특정 장소 image path list
   *
   * @example ['https://myapp-images.s3.amazonaws.com/uploads/profile123.jpg']
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
      week: place.placeDayList.reduce<PlaceWeekSchedule>(
        (acc, item) => {
          const key = item.day as PlaceWeekDay;
          const timeList: PlaceWeekInfo[] = item.placeHourList.map((hour) => ({
            startAt: hour.startAt,
            endAt: hour.endAt,
            breakTimeList: hour.placeBreakTimeList.map((bt) => ({
              startAt: bt.startAt,
              endAt: bt.endAt,
            })),
          }));
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
      keywordList: [],
      imagePathList: place.placeImageList.map((image) => image.path ?? ''),
    });
  }
}
