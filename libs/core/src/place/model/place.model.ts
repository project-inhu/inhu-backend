import { PlaceClosedDayModel } from './place-closed-day.model';
import type { PlaceType } from '../constants/place-type.constant';
import { PlaceOperatingHourModel } from './place-operating-hour.model';
import { PlaceBreakTimeModel } from './place-break-time.model';
import { PlaceRoadAddressModel } from './place-road-address.model';
import { SelectPlace } from './prisma-type/select-place';
import { PlaceWeeklyClosedDayModel } from './place-weekly-closed-day.model';
import { KeywordModel } from '@libs/core/keyword/model/keyword.model';

/**
 * 장소 모델
 *
 * @publicApi
 */
export class PlaceModel {
  /**
   * 장소 식별자
   */
  public idx: number;

  /**
   * 장소 이름
   */
  public name: string;

  /**
   * 장소 전화번호
   */
  public tel: string | null;

  /**
   * 리뷰 개수
   */
  public reviewCount: number;

  /**
   * 북마크 개수
   */
  public bookmarkCount: number;

  /**
   * 공휴일 휴무 여부
   *
   * - true: 공휴일 휴무
   * - false: 공휴일 정상 운영
   */
  public isClosedOnHoliday: boolean | null;

  /**
   * 생성 시간
   */
  public createdAt: Date;

  /**
   * 활성화 시간
   */
  public activatedAt: Date | null;

  /**
   * 폐업 여부
   */
  public permanentlyClosedAt: Date | null;

  /**
   * 이미지 경로 리스트
   */
  public imgPathList: string[];

  /**
   * 장소
   */
  public type: PlaceType;

  /**
   * 정기 휴무 리스트
   */
  public closedDayList: PlaceClosedDayModel[];

  /**
   * 장소 운영 시간 리스트
   */
  public operatingHourList: PlaceOperatingHourModel[];

  /**
   * 특정일 휴무 정보
   */
  public weeklyClosedDayList: PlaceWeeklyClosedDayModel[];

  /**
   * 브레이트 타임 정보
   */
  public breakTimeList: PlaceBreakTimeModel[];

  /**
   * 도로명 주소
   */
  public roadAddress: PlaceRoadAddressModel;

  public topKeywordList: KeywordModel[];

  constructor(data: PlaceModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(place: SelectPlace): PlaceModel {
    return new PlaceModel({
      idx: place.idx,
      name: place.name,
      tel: place.tel,
      reviewCount: place.reviewCount,
      bookmarkCount: place.bookmarkCount,
      isClosedOnHoliday: place.isClosedOnHoliday,
      createdAt: place.createdAt,
      activatedAt: place.activatedAt,
      permanentlyClosedAt: place.permanentlyClosedAt,
      imgPathList: place.placeImageList.map(({ path }) => path),
      breakTimeList: place.breakTimeList.map(PlaceBreakTimeModel.fromPrisma),
      type: place.placeTypeMappingList.map(
        ({ placeTypeIdx }) => placeTypeIdx,
      )[0] as PlaceType,
      topKeywordList: place.placeKeywordCountList.map(({ keyword }) =>
        KeywordModel.fromPrisma(keyword),
      ),
      closedDayList: place.closedDayList.map(PlaceClosedDayModel.fromPrisma),
      operatingHourList: place.operatingHourList.map(
        PlaceOperatingHourModel.fromPrisma,
      ),
      weeklyClosedDayList: place.weeklyClosedDayList.map(
        PlaceWeeklyClosedDayModel.fromPrisma,
      ),
      roadAddress: PlaceRoadAddressModel.fromPrisma(place.roadAddress),
    });
  }
}
