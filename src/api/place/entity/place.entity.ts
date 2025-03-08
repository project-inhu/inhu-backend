import { ApiProperty } from '@nestjs/swagger';
import { Week } from '../type/week.type';
import { Decimal } from '@prisma/client/runtime/library';
import { PlaceQueryResult } from '../interfaces/place-query-result.interface';
import { WEEKS } from '../common/constants/weeks.constant';
import { WeekScheduleDto } from '../dto/week-schedule.dto';

export class PlaceEntity {
  @ApiProperty({ description: 'place idx', example: 1 })
  idx: number;

  @ApiProperty({ description: 'place name', example: '동아리 닭갈비' })
  name: string;

  @ApiProperty({ description: 'place tel', example: '032-1111-2222' })
  tel: string;

  @ApiProperty({ description: 'place address', example: '인천 미추홀구' })
  address: string;

  @ApiProperty({ description: 'place addressX', example: 37.1111 })
  addressX: Decimal;

  @ApiProperty({ description: 'place addressY', example: 37.1111 })
  addressY: Decimal;

  @ApiProperty({
    description: '생성 날짜',
    example: '2024-02-23T12:34:56.789Z',
  })
  createdAt: Date;

  @ApiProperty()
  week: WeekScheduleDto;

  @ApiProperty({ description: 'review count', example: 1 })
  reviewCount: number;

  @ApiProperty({
    description: '현재 사용자가 특정 항목을 북마크했는지 여부',
    example: true,
  })
  bookmark: boolean;

  @ApiProperty({
    description: '특정 장소에서 가장 많이 사용된 review keyword 상위 2개',
    example: ['맛있어요.', '가성비 좋아요.'],
  })
  keywordList: string[];

  @ApiProperty({ description: '특정 장소 사진 path list', example: ['1234'] })
  imagePathList: string[];

  constructor(data: PlaceEntity) {
    Object.assign(this, data);
  }

  static createEntityFromPrisma(place: PlaceQueryResult): PlaceEntity {
    return new PlaceEntity({
      idx: place.idx,
      name: place.name,
      tel: place.tel,
      address: place.address,
      addressX: place.addressX,
      addressY: place.addressY,
      createdAt: place.createdAt,
      week: place.placeHours.reduce<WeekScheduleDto>(
        (acc, item) => {
          const key = item.day as Week;
          acc[key] = { startAt: item.startAt, endAt: item.endAt };
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
      reviewCount: place.review.length,
      bookmark: place.bookmark.length > 0 ? true : false,
      keywordList: [],
      imagePathList: place.placeImage.map((path) => path.imagePath ?? ''),
    });
  }
}
