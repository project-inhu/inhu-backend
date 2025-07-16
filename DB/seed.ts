import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDefaultOperatingHour(placeIdx: number) {
  const day = [0, 1, 2, 3, 4, 5, 6];

  const operatingHoursData = day.map((day) => ({
    placeIdx,
    day,
    startAt: new Date('1970-01-01T09:00:00Z'),
    endAt: new Date('1970-01-01T21:00:00Z'),
  }));

  await prisma.operatingHour.createMany({ data: operatingHoursData });
}

async function createDefaultBreakTime(placeIdx: number) {
  const day = [0, 1, 2, 3, 4, 5, 6];

  const breakTimesData = day.map((day) => ({
    placeIdx,
    day,
    startAt: new Date('1970-01-01T12:00:00Z'),
    endAt: new Date('1970-01-01T13:00:00Z'),
  }));

  await prisma.breakTime.createMany({ data: breakTimesData });
}

async function createDefaultMenu(placeIdx: number) {
  await prisma.menu.create({
    data: {
      placeIdx,
      name: '기본 메뉴',
      content: '기본 메뉴입니다',
      price: 4500,
      imagePath: '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg',
    },
  });
}

async function createDefaultPlaceImage(placeIdx: number) {
  await prisma.placeImage.create({
    data: { placeIdx, path: '/place/moscow.jpg' },
  });
}

async function createDefaultReview(placeIdx: number, userIdx: number) {
  const review = await prisma.review.create({
    data: {
      placeIdx,
      userIdx,
      content: '기본 리뷰',
    },
  });
  await prisma.reviewImage.create({
    data: {
      reviewIdx: review.idx,
      path: '/review/13072567-38f9-4941-9fb1-5eddb316f38d-bakery.jpg',
    },
  });
  await prisma.reviewKeywordMapping.createMany({
    data: [
      { reviewIdx: review.idx, keywordIdx: 1 },
      { reviewIdx: review.idx, keywordIdx: 2 },
    ],
  });
}

async function createDefaultPlaceTypeMapping(placeIdx: number) {
  await prisma.placeTypeMapping.create({
    data: {
      placeIdx: placeIdx,
      placeTypeIdx: 1,
    },
  });
}

const placeImagePaths = [
  '/place/hospital.jpg',
  '/place/soccer_field.jpg',
  '/place/theater.jpg',
  '/place/moscow.jpg',
  '/place/bakery.jpg',
];

const reviewImagePaths = [
  '/review/13072567-38f9-4941-9fb1-5eddb316f38d-bakery.jpg',
  '/review/38b902bb-38bb-41c6-b216-b9536a76088f-buns.jpg',
  '/review/4fbfbef0-b188-4816-820e-609e838ee5da-puppy.jpg',
  '/review/5525b1a6-85ea-4359-ad0d-ac54ed77ad54-cupcakes.jpg',
  '/review/b670f3ab-1512-49fa-9494-1e845570d300-cat.jpg',
];

async function main() {
  const user1 = await prisma.user.create({
    data: {
      nickname: '맛집탐방가',
      profileImagePath:
        '/profile/ddccb241-5fc2-4aca-9f6f-89a2b32edd68-puppy.jpg',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      nickname: '인덕이',
    },
  });

  type PlaceSeed = {
    name: string;
    tel?: string;
    addressName: string;
    addressX: number;
    addressY: number;
    detailAddress?: string;
    isClosedOnHoliday?: boolean;
  };
  const placesData: PlaceSeed[] = [
    {
      name: '메뉴 이미지 없음',
      tel: '032-111-0001',
      addressName: '인천 미추홀구 인하로 101',
      addressX: 126.654,
      addressY: 37.451,
    },
    {
      name: '메뉴 많음',
      tel: '032-111-0002',
      addressName: '인천 미추홀구 인하로 102',
      addressX: 126.655,
      addressY: 37.452,
    },
    {
      name: '메뉴 0개',
      tel: '032-111-0003',
      addressName: '인천 미추홀구 인하로 103',
      addressX: 126.656,
      addressY: 37.453,
    },
    {
      name: '메뉴 잘못된 이미지',
      tel: '032-111-0004',
      addressName: '인천 미추홀구 인하로 104',
      addressX: 126.657,
      addressY: 37.454,
    },
    {
      name: '장소 이미지 많음',
      tel: '032-111-0005',
      addressName: '인천 미추홀구 소성로 201',
      addressX: 126.658,
      addressY: 37.455,
    },
    {
      name: '장소 잘못된 이미지',
      tel: '032-111-0006',
      addressName: '인천 미추홀구 소성로 202',
      addressX: 126.659,
      addressY: 37.456,
    },
    {
      name: '장소 이미지 1개',
      tel: '032-111-0007',
      addressName: '인천 미추홀구 소성로 203',
      addressX: 126.66,
      addressY: 37.457,
    },
    {
      name: '운영시간 없음',
      tel: '032-111-0008',
      addressName: '인천 미추홀구 용현동 301',
      addressX: 126.661,
      addressY: 37.458,
    },
    {
      name: '정기 휴무일 있음',
      tel: '032-111-0009',
      addressName: '인천 미추홀구 용현동 302',
      addressX: 126.662,
      addressY: 37.459,
    },
    {
      name: '브레이크시간 없음',
      tel: '032-111-0010',
      addressName: '인천 미추홀구 용현동 303',
      addressX: 126.663,
      addressY: 37.46,
    },
    {
      name: '매일 운영',
      tel: '032-111-0011',
      addressName: '인천 미추홀구 학익동 401',
      addressX: 126.664,
      addressY: 37.461,
    },
    {
      name: '운영시간/브레이크 2번',
      tel: '032-111-0012',
      addressName: '인천 미추홀구 학익동 402',
      addressX: 126.665,
      addressY: 37.462,
    },
    {
      name: '리뷰 없음',
      tel: '032-111-0013',
      addressName: '인천 미추홀구 독배로 501',
      addressX: 126.666,
      addressY: 37.463,
    },
    {
      name: '리뷰 잘못된 이미지',
      tel: '032-111-0014',
      addressName: '인천 미추홀구 독배로 502',
      addressX: 126.667,
      addressY: 37.464,
    },
    {
      name: '리뷰 이미지 없음',
      tel: '032-111-0015',
      addressName: '인천 미추홀구 독배로 503',
      addressX: 126.668,
      addressY: 37.465,
    },
    {
      name: '리뷰 이미지 5개',
      tel: '032-111-0016',
      addressName: '인천 미추홀구 비룡길 601',
      addressX: 126.669,
      addressY: 37.466,
    },
    {
      name: '리뷰 키워드 없음',
      tel: '032-111-0017',
      addressName: '인천 미추홀구 비룡길 602',
      addressX: 126.67,
      addressY: 37.467,
    },
    {
      name: '리뷰 키워드 5개',
      tel: '032-111-0018',
      addressName: '인천 미추홀구 비룡길 603',
      addressX: 126.671,
      addressY: 37.468,
    },
    {
      name: '싯가 메뉴 있음',
      tel: '032-111-0019',
      addressName: '인천 미추홀구 싯가로 701',
      addressX: 126.672,
      addressY: 37.469,
    },
    {
      name: '전화번호 없음',
      addressName: '인천 미추홀구 인하로 801',
      addressX: 126.674,
      addressY: 37.45,
    },
    {
      name: '장소의 타입이 여러개',
      tel: '032-111-0021',
      addressName: '인천 미추홀구 인하로 501',
      addressX: 126.673,
      addressY: 37.41,
    },
    {
      name: '리뷰가 여러개',
      tel: '032-111-0022',
      addressName: '인천 미추홀구 인하로 903',
      addressX: 126.671,
      addressY: 37.43,
    },
    {
      name: '상세 주소 존재함',
      tel: '032-111-0023',
      addressName: '인천 미추홀구 인하로 909',
      detailAddress: '비룡플라자 1층',
      addressX: 126.632,
      addressY: 37.7,
    },
    {
      name: '매월 둘쨰, 넷째 화요일 휴무',
      tel: '032-111-0024',
      addressName: '인천 미추홀구 휴무로 903',
      addressX: 126.679,
      addressY: 37.402,
    },
    {
      name: '공휴일 휴무',
      tel: '032-111-0025',
      addressName: '인천 미추홀구 휴무로 904',
      addressX: 126.724,
      addressY: 37.492,
      isClosedOnHoliday: true,
    },
    {
      name: '격주 휴무',
      tel: '032-111-0026',
      addressName: '인천 미추홀구 휴무로 905',
      addressX: 126.721,
      addressY: 37.42,
    },
  ];

  for (let i = 0; i < placesData.length; i++) {
    const placeData = placesData[i];

    const createdRoadAddress = await prisma.roadAddress.create({
      data: {
        addressName: placeData.addressName,
        detailAddress: placeData.detailAddress,
        addressX: placeData.addressX,
        addressY: placeData.addressY,
      },
    });

    const place = await prisma.place.create({
      data: {
        name: placeData.name,
        tel: placeData.tel,
        roadAddressIdx: createdRoadAddress.idx,
        isClosedOnHoliday: placeData.isClosedOnHoliday ?? false,
      },
    });

    switch (placeData.name) {
      case '메뉴 이미지 없음':
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await prisma.menu.create({
          data: {
            placeIdx: place.idx,
            name: '이미지 없는 메뉴',
            content: '이미지 없어요',
            price: 10000,
          },
        });
        break;

      case '메뉴 많음':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        const manyMenus = Array.from({ length: 12 }, (_, i) => ({
          placeIdx: place.idx,
          name: `많은메뉴${i + 1}`,
          content: '메뉴 내용',
          price: 4000,
          imagePath: '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg',
        }));
        await prisma.menu.createMany({ data: manyMenus });
        break;

      case '메뉴 0개':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        break;

      case '메뉴 잘못된 이미지':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        await prisma.menu.create({
          data: {
            placeIdx: place.idx,
            name: '잘못된 이미지 메뉴',
            content: '잘못된 이미지 메뉴입니다',
            price: 10000,
            imagePath: 'invalid/path.jpg',
          },
        });
        break;

      case '장소 이미지 많음':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        const manyPlaceImages = placeImagePaths.map((path) => ({
          placeIdx: place.idx,
          path,
        }));

        await prisma.placeImage.createMany({ data: manyPlaceImages });
        break;

      case '장소 잘못된 이미지':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        await prisma.placeImage.create({
          data: { placeIdx: place.idx, path: 'invalid-place-path' },
        });
        break;

      case '장소 이미지 1개':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        break;

      case '운영시간 없음':
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        break;

      case '정기 휴무일 있음':
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        const operatingDays = [0, 1, 2, 3, 4, 5];
        const operatingHours = operatingDays.map((day) => ({
          placeIdx: place.idx,
          day,
          startAt: new Date('1970-01-01T10:00:00Z'),
          endAt: new Date('1970-01-01T20:00:00Z'),
        }));
        const breakTimes = operatingDays.map((day) => ({
          placeIdx: place.idx,
          day,
          startAt: new Date('1970-01-01T12:00:00Z'),
          endAt: new Date('1970-01-01T13:00:00Z'),
        }));
        await prisma.operatingHour.createMany({ data: operatingHours });
        await prisma.breakTime.createMany({ data: breakTimes });
        await prisma.closedDay.create({
          data: { placeIdx: place.idx, day: 6 },
        });

        break;

      case '브레이크시간 없음':
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        await createDefaultOperatingHour(place.idx);
        break;

      case '매일 운영':
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        break;

      case '운영시간/브레이크 2번':
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        const days = [0, 1, 2, 3, 4, 5, 6];
        const operatingHours1 = days.map((day) => ({
          placeIdx: place.idx,
          day,
          startAt: new Date('1970-01-01T11:00:00Z'),
          endAt: new Date('1970-01-01T15:00:00Z'),
        }));
        const breakTimes1 = days.map((day) => ({
          placeIdx: place.idx,
          day,
          startAt: new Date('1970-01-01T13:00:00Z'),
          endAt: new Date('1970-01-01T14:00:00Z'),
        }));

        const operatingHours2 = days.map((day) => ({
          placeIdx: place.idx,
          day,
          startAt: new Date('1970-01-01T17:00:00Z'),
          endAt: new Date('1970-01-01T21:00:00Z'),
        }));
        const breakTimes2 = days.map((day) => ({
          placeIdx: place.idx,
          day,
          startAt: new Date('1970-01-01T18:00:00Z'),
          endAt: new Date('1970-01-01T19:00:00Z'),
        }));

        await prisma.operatingHour.createMany({
          data: [...operatingHours1, ...operatingHours2],
        });

        await prisma.breakTime.createMany({
          data: [...breakTimes1, ...breakTimes2],
        });
        break;

      case '리뷰 없음':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        break;

      case '리뷰 잘못된 이미지':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        const review13 = await prisma.review.create({
          data: {
            placeIdx: place.idx,
            userIdx: user1.idx,
            content: '잘못된 리뷰',
          },
        });
        await prisma.reviewImage.create({
          data: { reviewIdx: review13.idx, path: 'invalid-review-path' },
        });
        await prisma.reviewKeywordMapping.createMany({
          data: [
            { reviewIdx: review13.idx, keywordIdx: 1 },
            { reviewIdx: review13.idx, keywordIdx: 2 },
          ],
        });
        break;

      case '리뷰 이미지 없음':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        const review14 = await prisma.review.create({
          data: {
            placeIdx: place.idx,
            userIdx: user1.idx,
            content: '이미지 없는 리뷰',
          },
        });
        await prisma.reviewKeywordMapping.createMany({
          data: [
            { reviewIdx: review14.idx, keywordIdx: 1 },
            { reviewIdx: review14.idx, keywordIdx: 2 },
          ],
        });
        break;

      case '리뷰 이미지 5개':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        const review15 = await prisma.review.create({
          data: {
            placeIdx: place.idx,
            userIdx: user1.idx,
            content: '리뷰 이미지 5개',
          },
        });
        const fiveReviewImages = reviewImagePaths.map((path) => ({
          reviewIdx: review15.idx,
          path,
        }));
        await prisma.reviewImage.createMany({ data: fiveReviewImages });
        await prisma.reviewKeywordMapping.createMany({
          data: [
            { reviewIdx: review15.idx, keywordIdx: 1 },
            { reviewIdx: review15.idx, keywordIdx: 2 },
          ],
        });

        break;

      case '리뷰 키워드 없음':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        const review16 = await prisma.review.create({
          data: {
            placeIdx: place.idx,
            userIdx: user1.idx,
            content: '키워드 없는 리뷰',
          },
        });
        await prisma.reviewImage.create({
          data: {
            reviewIdx: review16.idx,
            path: '/review/13072567-38f9-4941-9fb1-5eddb316f38d-bakery.jpg',
          },
        });
        break;

      case '리뷰 키워드 5개':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        const review17 = await prisma.review.create({
          data: {
            placeIdx: place.idx,
            userIdx: user1.idx,
            content: '키워드 5개 리뷰',
          },
        });
        await prisma.reviewImage.create({
          data: {
            reviewIdx: review17.idx,
            path: '/review/13072567-38f9-4941-9fb1-5eddb316f38d-bakery.jpg',
          },
        });
        const fiveKeywords = [1, 2, 3, 4, 5].map((keywordIdx) => ({
          reviewIdx: review17.idx,
          keywordIdx,
        }));
        await prisma.reviewKeywordMapping.createMany({ data: fiveKeywords });
        break;

      case '싯가 메뉴 있음':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        await prisma.menu.create({
          data: {
            placeIdx: place.idx,
            name: '싯가 메뉴 (활어회)',
            isFlexible: true,
            imagePath: '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg',
          },
        });
        break;

      case '전화번호 없음':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        break;

      case '장소의 타입이 여러개':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await prisma.placeTypeMapping.createMany({
          data: [
            { placeIdx: place.idx, placeTypeIdx: 1 },
            { placeIdx: place.idx, placeTypeIdx: 2 },
          ],
        });
        break;

      case '리뷰가 여러개':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        const keywordCombinations = [
          [1, 4],
          [2, 5],
          [3, 4],
          [1, 5],
          [2, 4],
          [3, 5],
          [1, 4, 5],
          [2],
          [3],
          [1, 4, 5],
        ];
        for (let i = 0; i < keywordCombinations.length; i++) {
          const currentUser = i % 2 === 0 ? user1 : user2;
          const review = await prisma.review.create({
            data: {
              placeIdx: place.idx,
              userIdx: currentUser.idx,
              content: '리뷰가 여러개',
            },
          });

          await prisma.reviewImage.create({
            data: { reviewIdx: review.idx, path: reviewImagePaths[i % 5] },
          });

          const keywordData = keywordCombinations[i].map((keywordId) => ({
            reviewIdx: review.idx,
            keywordIdx: keywordId,
          }));

          if (keywordData.length > 0) {
            await prisma.reviewKeywordMapping.createMany({
              data: keywordData,
            });
          }
        }
        break;

      case '상세 주소 존재함':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        break;

      case '매월 둘째, 넷째 화요일 휴무':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        await prisma.closedDay.createMany({
          data: [
            { placeIdx: place.idx, day: 2, week: 2 },
            { placeIdx: place.idx, day: 2, week: 4 },
          ],
        });
        break;

      case '공휴일 휴무':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        break;

      case '격주 휴무':
        await createDefaultOperatingHour(place.idx);
        await createDefaultBreakTime(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        await prisma.weeklyClosedDay.create({
          data: {
            placeIdx: place.idx,
            closedDate: new Date('2025-07-02T00:00:00'),
          },
        });
    }
  }

  const keywordCounts = [
    { placeIdx: 1, keywordIdx: 1, count: 1 },
    { placeIdx: 1, keywordIdx: 2, count: 1 },
    { placeIdx: 2, keywordIdx: 1, count: 1 },
    { placeIdx: 2, keywordIdx: 2, count: 1 },
    { placeIdx: 3, keywordIdx: 1, count: 1 },
    { placeIdx: 3, keywordIdx: 2, count: 1 },
    { placeIdx: 4, keywordIdx: 1, count: 1 },
    { placeIdx: 4, keywordIdx: 2, count: 1 },
    { placeIdx: 5, keywordIdx: 1, count: 1 },
    { placeIdx: 5, keywordIdx: 2, count: 1 },
    { placeIdx: 6, keywordIdx: 1, count: 1 },
    { placeIdx: 6, keywordIdx: 2, count: 1 },
    { placeIdx: 7, keywordIdx: 1, count: 1 },
    { placeIdx: 7, keywordIdx: 2, count: 1 },
    { placeIdx: 8, keywordIdx: 1, count: 1 },
    { placeIdx: 8, keywordIdx: 2, count: 1 },
    { placeIdx: 9, keywordIdx: 1, count: 1 },
    { placeIdx: 9, keywordIdx: 2, count: 1 },
    { placeIdx: 10, keywordIdx: 1, count: 1 },
    { placeIdx: 10, keywordIdx: 2, count: 1 },
    { placeIdx: 11, keywordIdx: 1, count: 1 },
    { placeIdx: 11, keywordIdx: 2, count: 1 },
    { placeIdx: 12, keywordIdx: 1, count: 1 },
    { placeIdx: 12, keywordIdx: 2, count: 1 },
    { placeIdx: 14, keywordIdx: 1, count: 1 },
    { placeIdx: 14, keywordIdx: 2, count: 1 },
    { placeIdx: 15, keywordIdx: 1, count: 1 },
    { placeIdx: 15, keywordIdx: 2, count: 1 },
    { placeIdx: 16, keywordIdx: 1, count: 1 },
    { placeIdx: 16, keywordIdx: 2, count: 1 },
    { placeIdx: 18, keywordIdx: 1, count: 1 },
    { placeIdx: 18, keywordIdx: 2, count: 1 },
    { placeIdx: 18, keywordIdx: 3, count: 1 },
    { placeIdx: 18, keywordIdx: 4, count: 1 },
    { placeIdx: 18, keywordIdx: 5, count: 1 },
    { placeIdx: 19, keywordIdx: 1, count: 1 },
    { placeIdx: 19, keywordIdx: 2, count: 1 },
    { placeIdx: 20, keywordIdx: 1, count: 1 },
    { placeIdx: 20, keywordIdx: 2, count: 1 },
    { placeIdx: 21, keywordIdx: 1, count: 1 },
    { placeIdx: 21, keywordIdx: 2, count: 1 },
    { placeIdx: 22, keywordIdx: 1, count: 4 },
    { placeIdx: 22, keywordIdx: 2, count: 3 },
    { placeIdx: 22, keywordIdx: 3, count: 3 },
    { placeIdx: 22, keywordIdx: 4, count: 6 },
    { placeIdx: 22, keywordIdx: 5, count: 6 },
    { placeIdx: 23, keywordIdx: 1, count: 1 },
    { placeIdx: 23, keywordIdx: 2, count: 1 },
    { placeIdx: 24, keywordIdx: 1, count: 1 },
    { placeIdx: 24, keywordIdx: 2, count: 1 },
    { placeIdx: 25, keywordIdx: 1, count: 1 },
    { placeIdx: 25, keywordIdx: 2, count: 1 },
    { placeIdx: 26, keywordIdx: 1, count: 1 },
    { placeIdx: 26, keywordIdx: 2, count: 1 },
  ];
  await prisma.placeKeywordCount.createMany({
    data: keywordCounts,
  });

  const bookmarkData = [
    { userIdx: user1.idx, placeIdx: 2 },
    { userIdx: user1.idx, placeIdx: 11 },
    { userIdx: user1.idx, placeIdx: 19 },
    { userIdx: user1.idx, placeIdx: 22 },
    { userIdx: user2.idx, placeIdx: 1 },
    { userIdx: user2.idx, placeIdx: 11 },
    { userIdx: user2.idx, placeIdx: 21 },
  ];
  await prisma.bookmark.createMany({ data: bookmarkData });

  await prisma.$executeRawUnsafe(
    `UPDATE place_tb SET review_count = (SELECT COUNT(*) FROM review_tb WHERE place_idx = place_tb.idx)`,
  );

  const pickedPlacesData = [
    {
      placeIdx: 2,
      title: '결정장애 필독! 메뉴만 12개',
      content: '김밥부터 파스타까지, 없는 게 없는 우리 동네 대표 맛집!',
    },
    {
      placeIdx: 5,
      title: '사진만 봐도 가고 싶어지는 곳',
      content:
        '사장님이 포토그래퍼? 감성 넘치는 인테리어와 플레이팅을 만나보세요.',
    },
    {
      placeIdx: 9,
      title: '일요일은 쉬지만 후회 없어요',
      content:
        '주 6일만으로도 동네를 평정한 찐맛집. 평일 저녁이나 토요일 방문을 추천합니다.',
    },
    {
      placeIdx: 10,
      title: '브레이크 타임 없는 착한 가게',
      content: '애매한 시간에도 OK! 언제 방문해도 편안하게 식사할 수 있습니다.',
    },
    {
      placeIdx: 11,
      title: '365일 연중무휴! 언제나 우리 곁에',
      content:
        '언제 찾아가도 항상 열려있는 우리 동네 단골 가게입니다. 명절에도 영업해요!',
    },
    {
      placeIdx: 12,
      title: '점심과 저녁, 두 번의 미식 경험',
      content:
        '점심 특선과 저녁 메인 메뉴가 모두 훌륭한 곳. 두 번 방문해도 새로워요.',
    },
    {
      placeIdx: 19,
      title: '오늘의 시세는? 신선함이 생명',
      content:
        '매일매일 가장 신선한 횟감을 싯가로 제공하는 믿을 수 있는 횟집입니다.',
    },
    {
      placeIdx: 21,
      title: '식사와 커피를 한 번에!',
      content: '맛있는 파스타와 향긋한 스페셜티 커피를 한 공간에서 즐겨보세요.',
    },
    {
      placeIdx: 22,
      title: '수많은 리뷰가 증명하는 동네 1등',
      content:
        '광고가 아닌 진짜 후기들로 가득한, 주민들이 인정한 찐맛집입니다.',
    },
    {
      placeIdx: 7,
      title: '단 하나의 이미지로 승부',
      content:
        '화려하진 않지만, 대표 메뉴 하나로 승부하는 자신감 있는 맛집입니다.',
    },
    {
      placeIdx: 14,
      title: '쉬는 시간 없이 달리는 열정 맛집',
      content:
        '애매한 오후 3시, 출출할 때 더 이상 헛걸음하지 마세요! 언제나 여러분을 기다립니다.',
    },
  ];
  await prisma.pickedPlace.createMany({ data: pickedPlacesData });
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
