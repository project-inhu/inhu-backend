import { faker } from '@faker-js/faker';
import { defaultValue } from '@libs/common/utils/default-value.util';
import {
  getRandomValues,
  pickRandomValue,
} from '@libs/common/utils/random.util';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { PlaceSeedInput } from '@libs/testing/seed/place/type/place-seed.input';
import { PlaceSeedOutput } from '@libs/testing/seed/place/type/place-seed.output';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

/**
 * place 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class PlaceSeedHelper extends ISeedHelper<
  PlaceSeedInput,
  PlaceSeedOutput
> {
  public generateFilledInputValue(
    input: PlaceSeedInput,
  ): FilledSeedInput<PlaceSeedInput> {
    return {
      name: defaultValue(
        input.name,
        faker.word.noun({ length: { min: 5, max: 20 } }),
      ),
      tel: defaultValue(input.tel, null),
      reviewCount: defaultValue(input.reviewCount, 0),
      bookmarkCount: defaultValue(input.bookmarkCount, 0),
      isClosedOnHoliday: defaultValue(input.isClosedOnHoliday, null),
      deletedAt: defaultValue(input.deletedAt, null),
      permanentlyClosedAt: defaultValue(input.permanentlyClosedAt, null),
      activatedAt: defaultValue(input.activatedAt, null),
      placeImgList: defaultValue(
        input.placeImgList,
        getRandomValues(1, 5, () => `/place-image/${faker.string.uuid()}.png`),
      ),
      type: defaultValue(input.type, pickRandomValue(PlaceType)),
      roadAddress: {
        name: defaultValue(
          input.roadAddress?.name,
          faker.location.county() + ' ' + faker.location.city(),
        ),
        detail: defaultValue(input.roadAddress?.detail, null),
        addressX: defaultValue(
          input.roadAddress?.addressX,
          faker.location.longitude(),
        ),
        addressY: defaultValue(
          input.roadAddress?.addressY,
          faker.location.latitude(),
        ),
      },
      closedDayList: defaultValue(input.closedDayList, null),
      operatingHourList: defaultValue(input.operatingHourList, null),
      weeklyClosedDayList: defaultValue(input.weeklyClosedDayList, null),
      breakTime: defaultValue(input.breakTime, null),
      keywordCountList: defaultValue(input.keywordCountList, null),
    };
  }

  public async seed(input: PlaceSeedInput): Promise<PlaceSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const location = await this.prisma.roadAddress.create({
      data: {
        addressName: filledInput.roadAddress.name,
        detailAddress: filledInput.roadAddress.detail,
        addressX: filledInput.roadAddress.addressX,
        addressY: filledInput.roadAddress.addressY,
      },
    });

    const place = await this.prisma.place.create({
      select: { idx: true },
      data: {
        name: filledInput.name,
        tel: filledInput.tel,
        reviewCount: filledInput.reviewCount,
        bookmarkCount: filledInput.bookmarkCount,
        isClosedOnHoliday: filledInput.isClosedOnHoliday,
        permanentlyClosedAt: filledInput.permanentlyClosedAt,
        activatedAt: filledInput.activatedAt,
        deletedAt: filledInput.deletedAt,
        placeImageList: {
          createMany: {
            data: filledInput.placeImgList.map((imagePath) => ({
              imagePath,
            })),
          },
        },
        placeTypeMappingList: {
          create: {
            placeTypeIdx: filledInput.type,
          },
        },
        roadAddressIdx: location.idx,
        closedDayList: filledInput.closedDayList
          ? {
              createMany: {
                data: filledInput.closedDayList.map((day) => ({
                  day: day.day,
                  week: day.week,
                })),
              },
            }
          : undefined,
        operatingHourList: filledInput.operatingHourList
          ? {
              createMany: {
                data: filledInput.operatingHourList.map(
                  ({ day, endAt, startAt }) => ({
                    day,
                    endAt: this.transformKoreanTime(endAt),
                    startAt: this.transformKoreanTime(startAt),
                  }),
                ),
              },
            }
          : undefined,
        weeklyClosedDayList: filledInput.weeklyClosedDayList
          ? {
              createMany: {
                data: filledInput.weeklyClosedDayList.map(
                  ({ closedDate, type }) => ({
                    closedDate: this.transformKoreanDate(closedDate),
                    type,
                  }),
                ),
              },
            }
          : undefined,
        breakTimeList: filledInput.breakTime
          ? {
              createMany: {
                data: filledInput.breakTime.map(({ day, endAt, startAt }) => ({
                  day,
                  endAt: this.transformKoreanTime(endAt),
                  startAt: this.transformKoreanTime(startAt),
                })),
              },
            }
          : undefined,
        placeKeywordCountList: filledInput.keywordCountList
          ? {
              createMany: {
                data: filledInput.keywordCountList.map(
                  ({ keywordIdx, count }) => ({
                    keywordIdx,
                    count,
                  }),
                ),
              },
            }
          : undefined,
      },
    });

    return { idx: place.idx, ...filledInput };
  }

  private transformKoreanTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    return `1970-01-01T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  }

  private transformKoreanDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}T00:00:00Z`;
  }
}
