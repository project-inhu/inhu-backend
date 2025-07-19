import { faker } from '@faker-js/faker/.';
import { defaultValue, getRandomValues, pickRandomValue } from '@libs/common';
import { PLACE_TYPE } from '@libs/core';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { PlaceSeedInput } from '@libs/testing/seed/place/type/place-seed.input';
import { PlaceSeedOutput } from '@libs/testing/seed/place/type/place-seed.output';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

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
      isClosedOnHoliday: defaultValue(input.isClosedOnHoliday, false),
      deletedAt: defaultValue(input.deletedAt, null),
      permanentlyClosedAt: defaultValue(input.permanentlyClosedAt, null),
      activatedAt: defaultValue(input.activatedAt, null),
      placeImgList: defaultValue(
        input.placeImgList,
        getRandomValues(1, 5, () => `/place-image/${faker.string.uuid()}.png`),
      ),
      type: defaultValue(input.type, pickRandomValue(PLACE_TYPE)),
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
        placeImageList: {
          createMany: {
            data: filledInput.placeImgList.map((path) => ({
              path,
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
                  week: day.dayOfWeek,
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
                    endAt,
                    startAt,
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
                    closedDate,
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
                  endAt,
                  startAt,
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
}
