import { ApiProperty } from '@nestjs/swagger';
import { WeekSchedule } from '../type/week-schedule.type';
import { Week } from '../type/week.type';
import { Decimal } from '@prisma/client/runtime/library';
import { PlaceQueryResult } from '../interfaces/place-query-result.interface';

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

  @ApiProperty({
    description: '요일별 운영 시간',
    example: {
      mon: { startAt: '09:00', endAt: '18:00' },
      tue: null,
      wed: { startAt: '10:00', endAt: '22:00' },
      thu: { startAt: '09:00', endAt: '18:00' },
      fri: { startAt: '09:00', endAt: '18:00' },
      sat: null,
      sun: null,
    },
  })
  week: WeekSchedule;

  @ApiProperty({ description: 'review count', example: 1 })
  reviewCount: number;

  @ApiProperty({
    description: '현재 사용자가 특정 항목을 북마크했는지 여부',
    example: true,
  })
  bookmark: boolean;

  // @ApiProperty({
  //   description: '특정 장소에서 가장 많이 사용된 review keyword 상위 2개',
  //   example: ['맛있어요.', '가성비 좋아요.'],
  // })
  // keyword: string[];

  @ApiProperty({ description: '특정 장소 사진 path list', example: ['1234'] })
  imagePath: string[];

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
      week: place.placeHours.reduce<WeekSchedule>(
        (acc, item) => {
          const key = item.day as Week;
          acc[key] = { startAt: item.startAt, endAt: item.endAt };
          return acc;
        },
        {
          mon: null,
          tue: null,
          wed: null,
          thu: null,
          fri: null,
          sat: null,
          sun: null,
        },
      ),
      reviewCount: place.review.length,
      bookmark: place.bookmark.length > 0 ? true : false,
      // keyword: [],
      imagePath: place.placeImage.map((path) => path.imagePath ?? ''),
    });
  }
}
