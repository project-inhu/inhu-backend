import { KeywordEntity } from '@user/api/keyword/entity/keyword.entity';
import { PlaceRoadAddressEntity } from './place-road-address.entity';
import { PlaceWeeklyClosedDayEntity } from './place-weekly-closed-day';
import { PlaceOperatingHourEntity } from './place-operating-hour.entity';
import { PlaceModel, PlaceType } from '@libs/core';
import { PlaceClosedDayEntity } from '@user/api/place/entity/place-closed-day.entity';
import { PlaceBreakTimeEntity } from '@user/api/place/entity/place-break-time.entity';

export class PlaceEntity {
  /**
   * place Idx
   *
   * @example 1
   */
  public idx: number;

  /**
   * place name
   *
   * @example '동아리 닭갈비'
   */
  public name: string;

  /**
   * 상호 전화번호
   *
   * @example '032-1111-2222'
   */
  public tel: string | null;

  /**
   * 주소
   */
  public roadAddress: PlaceRoadAddressEntity;

  /**
   * 해당 장소에 가장 많이 평가된 최대 2개의 키워드 목록
   */
  public topKeywordList: KeywordEntity[];

  /**
   * 생성 날짜
   */
  public createdAt: Date;

  /**
   * review count
   *
   * @example 1
   */
  public reviewCount: number;

  /**
   * 공휴일에 쉬는지 유무
   *
   * @example false
   */
  public isClosedOnHoliday: boolean;

  /**
   * 현재 사용자가 특정 항목을 북마크했는지 여부
   */
  public bookmark: boolean;

  /**
   * 특정 장소 image path list
   *
   * @example ['place/f9c2e36f-8e99-4b18-b3e8-7cd327682f94_20240706_124512.jpg', 'place/12345678-1234-5678-1234-123456789012_20240706_124512.jpg']
   */
  public imagePathList: string[];

  /**
   * 특정 장소의 타입
   */
  public type: PlaceType;

  /**
   * 격주 또는 규칙 휴무일 정보
   */
  public weeklyClosedDayList: PlaceWeeklyClosedDayEntity[];

  /**
   * 운영 시간 정보
   */
  public operatingHourList: PlaceOperatingHourEntity[];

  /**
   * 정기 휴무일 정보
   */
  public closedDayList: PlaceClosedDayEntity[];

  /**
   * 브레이크 타임 정보
   */
  public breakTimeList: PlaceBreakTimeEntity[];

  constructor(data: PlaceEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: PlaceModel, bookmark: boolean): PlaceEntity {
    return new PlaceEntity({
      idx: model.idx,
      name: model.name,
      tel: model.tel,
      roadAddress: PlaceRoadAddressEntity.fromModel(model.roadAddress),
      topKeywordList: model.topKeywordList.map(KeywordEntity.fromModel),
      createdAt: model.createdAt,
      reviewCount: model.reviewCount,
      isClosedOnHoliday: model.isClosedOnHoliday,
      bookmark,
      imagePathList: model.imgPathList,
      type: model.type,
      weeklyClosedDayList: model.weeklyClosedDayList.map(
        PlaceWeeklyClosedDayEntity.fromModel,
      ),
      operatingHourList: model.operatingHourList.map(
        PlaceOperatingHourEntity.fromModel,
      ),
      closedDayList: model.closedDayList.map(PlaceClosedDayEntity.fromModel),
      breakTimeList: model.breakTimeList.map(PlaceBreakTimeEntity.fromModel),
    });
  }
}
