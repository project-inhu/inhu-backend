import { PlaceSelectField } from '../type/place-select-field.type';
import { OperatingWeekSchedule } from '../type/operating-week-schedule.type';
import {
  formatDateOnly,
  formatTimeFromDate,
} from '@user/common/utils/date.util';
import { KeywordEntity } from '@user/api/keyword/entity/keyword.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { TypeEntity } from '@user/api/type/entity/type.entity';
import { BreakTimeInfo } from '../type/break-time-info.type';

class PlaceKeywordEntity extends PickType(KeywordEntity, ['idx', 'content']) {}

class PlaceTypeEntity extends PickType(TypeEntity, ['idx', 'content']) {}
/**
 * place entity
 *
 * @author 강정연
 */
export class PlaceEntity {
  @ApiProperty({
    description: '요일별 운영 시간 및 브레이크타임 정보',
    example: {
      '0': [
        {
          startAt: '09:00',
          endAt: '21:00',
          breakTimeList: [
            { startAt: '12:00', endAt: '13:00' },
            { startAt: '17:00', endAt: '17:30' },
          ],
        },
      ],
      '2': [
        {
          startAt: '10:00',
          endAt: '22:00',
          breakTimeList: [],
        },
      ],
      '5': [
        {
          startAt: '11:00',
          endAt: '20:00',
          breakTimeList: [{ startAt: '15:00', endAt: '15:30' }],
        },
      ],
      '6': null,
    },
  })
  week: OperatingWeekSchedule;

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
   * 도로명 주소
   *
   * @example '인천 미추홀구 인하로 123'
   */
  addressName: string;

  /**
   * 상세 주소
   *
   * @example '비룡플라자 1층'
   */
  detailAddress: string | null;

  /**
   * place addressX
   *
   * @example 37.1111
   */
  addressX: number;

  /**
   * place addressY
   *
   * @example 37.1111
   */
  addressY: number;

  /**
   * 생성 날짜
   */
  createdAt: Date;

  /**
   * 추가적인 휴무 정보 (격주, 특정일 등)
   * @example ["매월 1, 3주차 수요일 휴무"]
   */
  closingInfo: string[];

  /**
   * review count
   *
   * @example 1
   */
  reviewCount: number;

  /**
   * 공휴일에 쉬는지 유무
   *
   * @example false
   */
  isClosedOnHoliday: boolean;

  /**
   * 현재 사용자가 특정 항목을 북마크했는지 여부
   */
  bookmark: boolean;

  /**
   * 특정 장소에서 가장 많이 사용된 review keyword 상위 2개
   */
  keywordList: PlaceKeywordEntity[];

  /**
   * 특정 장소 image path list
   *
   * @example ['place/f9c2e36f-8e99-4b18-b3e8-7cd327682f94_20240706_124512.jpg', 'place/12345678-1234-5678-1234-123456789012_20240706_124512.jpg']
   */
  imagePathList: string[];

  /**
   * 특정 장소의 타입
   */
  typeList: PlaceTypeEntity[];

  constructor(data: PlaceEntity) {
    Object.assign(this, data);
  }

  static createEntityFromPrisma(place: PlaceSelectField): PlaceEntity {
    const roadAddr = place.roadAddress;

    const week: OperatingWeekSchedule = {};

    for (let day = 0; day <= 6; day++) {
      const opHours = place.operatingHourList.filter(
        (hour) => hour.day === day,
      );
      // 해당 요일이 정기 휴무일인지 확인
      const isClosedDay = place.closedDayList.some(
        (cd) => cd.day === day && cd.week === null,
      );

      // 운영시간도 없고 휴무일인 경우 -> 정기 휴무일 -> 빈 배열을 담아줌
      if (opHours.length === 0 && isClosedDay) {
        week[day] = [];
        continue;
      }

      // 운영시간 없지만 휴무일이 아닌 경우 -> 정보 없음 -> null
      if (opHours.length === 0 && !isClosedDay) {
        week[day] = null;
        continue;
      }

      //운영시간이 있는 경우 브레이크 타임도 매칭시켜 등록함
      const breakList = place.breakTimeList.filter((bt) => bt.day === day);

      week[day] = opHours.map((hour) => {
        const start = formatTimeFromDate(hour.startAt);
        const end = formatTimeFromDate(hour.endAt);

        const matchedBreakList: BreakTimeInfo[] = breakList
          .filter(
            (bt) =>
              formatTimeFromDate(bt.startAt) >= start &&
              formatTimeFromDate(bt.endAt) <= end,
          )
          .map((bt) => ({
            startAt: formatTimeFromDate(bt.startAt),
            endAt: formatTimeFromDate(bt.endAt),
          }));

        return {
          startAt: start,
          endAt: end,
          breakTimeList: matchedBreakList,
        };
      });
    }

    return new PlaceEntity({
      week,
      idx: place.idx,
      name: place.name,
      tel: place.tel,
      addressName: roadAddr.addressName,
      detailAddress: roadAddr.detailAddress,
      addressX: parseFloat(roadAddr.addressX.toString()),
      addressY: parseFloat(roadAddr.addressY.toString()),
      createdAt: place.createdAt,
      isClosedOnHoliday: place.isClosedOnHoliday,
      closingInfo: this.buildClosingInfo(
        place.closedDayList,
        place.weeklyClosedDayList,
        place.isClosedOnHoliday,
      ),
      reviewCount: place.reviewCount,
      bookmark: !!place.bookmarkList?.length,
      keywordList: place.placeKeywordCountList.map(({ keyword }) => ({
        idx: keyword.idx,
        content: keyword.content,
      })),

      imagePathList: place.placeImageList.map((img) => img.path ?? ''),

      typeList: place.placeTypeMappingList.map(({ placeType }) => ({
        idx: placeType.idx,
        content: placeType.content,
      })),
    });
  }

  /**
   * 휴무일 정보를 string[] 형태로 가공
   */
  private static buildClosingInfo(
    closedDayList: { day: number; week: number | null }[],
    weeklyClosedDayList: { closedDate: Date }[],
    isClosedOnHoliday: boolean,
  ): string[] {
    const result: string[] = [];

    const WEEKDAY_LABEL = [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
    ];

    closedDayList.forEach(({ day, week }) => {
      const dayLabel = WEEKDAY_LABEL[day] ?? `요일(${day})`;
      if (week !== null) {
        result.push(`매월 ${week}주차 ${dayLabel} 휴무`);
      } else {
        result.push(`매주 ${dayLabel} 휴무`);
      }
    });

    if (weeklyClosedDayList.length > 0) {
      const dateList = [
        ...new Set(
          weeklyClosedDayList.map((d) => formatDateOnly(d.closedDate)),
        ),
      ];
      result.push('격주 휴무');
    }

    if (isClosedOnHoliday) {
      result.push('공휴일 휴무');
    }

    return result;
  }
}
