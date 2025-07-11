import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDefaultOperatingHours(placeIdx: number) {
  for (const day of ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']) {
    const opDay = await prisma.operatingDay.create({
      data: { placeIdx, day },
    });
    const operatingHour = await prisma.operatingHour.create({
      data: {
        operatingDayIdx: opDay.idx,
        startAt: new Date('1970-01-01T09:00:00Z'),
        endAt: new Date('1970-01-01T21:00:00Z'),
      },
    });
    await prisma.breakTime.create({
      data: {
        operatingHourIdx: operatingHour.idx,
        startAt: new Date('1970-01-01T12:00:00Z'),
        endAt: new Date('1970-01-01T13:00:00Z'),
      },
    });
  }
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

  const placesData = [
    {
      name: '메뉴 이미지 없음',
      tel: '032-111-0001',
      address: '인천 미추홀구 인하로 101',
      addressX: 126.654,
      addressY: 37.451,
    },
    {
      name: '메뉴 많음',
      tel: '032-111-0002',
      address: '인천 미추홀구 인하로 102',
      addressX: 126.655,
      addressY: 37.452,
    },
    {
      name: '메뉴 0개',
      tel: '032-111-0003',
      address: '인천 미추홀구 인하로 103',
      addressX: 126.656,
      addressY: 37.453,
    },
    {
      name: '메뉴 잘못된 이미지',
      tel: '032-111-0004',
      address: '인천 미추홀구 인하로 104',
      addressX: 126.657,
      addressY: 37.454,
    },
    {
      name: '장소 이미지 많음',
      tel: '032-111-0005',
      address: '인천 미추홀구 소성로 201',
      addressX: 126.658,
      addressY: 37.455,
    },
    {
      name: '장소 잘못된 이미지',
      tel: '032-111-0006',
      address: '인천 미추홀구 소성로 202',
      addressX: 126.659,
      addressY: 37.456,
    },
    {
      name: '장소 이미지 1개',
      tel: '032-111-0007',
      address: '인천 미추홀구 소성로 203',
      addressX: 126.66,
      addressY: 37.457,
    },
    {
      name: '운영시간 없음',
      tel: '032-111-0008',
      address: '인천 미추홀구 용현동 301',
      addressX: 126.661,
      addressY: 37.458,
    },
    {
      name: '휴무일 있음',
      tel: '032-111-0009',
      address: '인천 미추홀구 용현동 302',
      addressX: 126.662,
      addressY: 37.459,
    },
    {
      name: '브레이크시간 없음',
      tel: '032-111-0010',
      address: '인천 미추홀구 용현동 303',
      addressX: 126.663,
      addressY: 37.46,
    },
    {
      name: '매일 운영',
      tel: '032-111-0011',
      address: '인천 미추홀구 학익동 401',
      addressX: 126.664,
      addressY: 37.461,
    },
    {
      name: '운영시간/브레이크 2번',
      tel: '032-111-0012',
      address: '인천 미추홀구 학익동 402',
      addressX: 126.665,
      addressY: 37.462,
    },
    {
      name: '리뷰 없음',
      tel: '032-111-0013',
      address: '인천 미추홀구 독배로 501',
      addressX: 126.666,
      addressY: 37.463,
    },
    {
      name: '리뷰 잘못된 이미지',
      tel: '032-111-0014',
      address: '인천 미추홀구 독배로 502',
      addressX: 126.667,
      addressY: 37.464,
    },
    {
      name: '리뷰 이미지 없음',
      tel: '032-111-0015',
      address: '인천 미추홀구 독배로 503',
      addressX: 126.668,
      addressY: 37.465,
    },
    {
      name: '리뷰 이미지 5개',
      tel: '032-111-0016',
      address: '인천 미추홀구 비룡길 601',
      addressX: 126.669,
      addressY: 37.466,
    },
    {
      name: '리뷰 키워드 없음',
      tel: '032-111-0017',
      address: '인천 미추홀구 비룡길 602',
      addressX: 126.67,
      addressY: 37.467,
    },
    {
      name: '리뷰 키워드 5개',
      tel: '032-111-0018',
      address: '인천 미추홀구 비룡길 603',
      addressX: 126.671,
      addressY: 37.468,
    },
    {
      name: '싯가 메뉴 있음',
      tel: '032-111-0019',
      address: '인천 미추홀구 싯가로 701',
      addressX: 126.672,
      addressY: 37.469,
    },
    {
      name: '전화번호 없음',
      address: '인천 미추홀구 인하로 801',
      addressX: 126.674,
      addressY: 37.45,
    },
    {
      name: '장소의 타입이 여러개',
      tel: '032-111-0021',
      address: '인천 미추홀구 인하로 501',
      addressX: 126.673,
      addressY: 37.41,
    },
    {
      name: '리뷰가 여러개',
      tel: '032-111-0022',
      address: '인천 미추홀구 인하로 903',
      addressX: 126.671,
      addressY: 37.43,
    },
  ];

  for (let i = 0; i < placesData.length; i++) {
    const placeData = placesData[i];
    const place = await prisma.place.create({ data: placeData });

    switch (placeData.name) {
      case '메뉴 이미지 없음':
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        await createDefaultOperatingHours(place.idx);
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
        await createDefaultOperatingHours(place.idx);
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
        await createDefaultOperatingHours(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        break;

      case '메뉴 잘못된 이미지':
        await createDefaultOperatingHours(place.idx);
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
        await createDefaultOperatingHours(place.idx);
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
        await createDefaultOperatingHours(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        await prisma.placeImage.create({
          data: { placeIdx: place.idx, path: 'invalid-place-path' },
        });
        break;

      case '장소 이미지 1개':
        await createDefaultOperatingHours(place.idx);
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

      case '휴무일 있음':
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        for (const day of ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']) {
          const opDay = await prisma.operatingDay.create({
            data: { placeIdx: place.idx, day },
          });
          const opHour = await prisma.operatingHour.create({
            data: {
              operatingDayIdx: opDay.idx,
              startAt: new Date('1970-01-01T09:00:00Z'),
              endAt: new Date('1970-01-01T21:00:00Z'),
            },
          });
          await prisma.breakTime.create({
            data: {
              operatingHourIdx: opHour.idx,
              startAt: new Date('1970-01-01T12:00:00Z'),
              endAt: new Date('1970-01-01T13:00:00Z'),
            },
          });
        }
        await prisma.operatingDay.create({
          data: { placeIdx: place.idx, day: 'sun' },
        });
        break;

      case '브레이크시간 없음':
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        for (const day of ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']) {
          const opDay = await prisma.operatingDay.create({
            data: { placeIdx: place.idx, day },
          });
          await prisma.operatingHour.create({
            data: {
              operatingDayIdx: opDay.idx,
              startAt: new Date('1970-01-01T09:00:00Z'),
              endAt: new Date('1970-01-01T21:00:00Z'),
            },
          });
        }
        break;

      case '매일 운영':
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultOperatingHours(place.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        break;

      case '운영시간/브레이크 2번':
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        for (const day of ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']) {
          const opDay = await prisma.operatingDay.create({
            data: { placeIdx: place.idx, day: day },
          });

          const hour1 = await prisma.operatingHour.create({
            data: {
              operatingDayIdx: opDay.idx,
              startAt: new Date('1970-01-01T11:00:00Z'),
              endAt: new Date('1970-01-01T15:00:00Z'),
            },
          });
          await prisma.breakTime.create({
            data: {
              operatingHourIdx: hour1.idx,
              startAt: new Date('1970-01-01T13:00:00Z'),
              endAt: new Date('1970-01-01T14:00:00Z'),
            },
          });

          const hour2 = await prisma.operatingHour.create({
            data: {
              operatingDayIdx: opDay.idx,
              startAt: new Date('1970-01-01T17:00:00Z'),
              endAt: new Date('1970-01-01T21:00:00Z'),
            },
          });
          await prisma.breakTime.create({
            data: {
              operatingHourIdx: hour2.idx,
              startAt: new Date('1970-01-01T18:00:00Z'),
              endAt: new Date('1970-01-01T19:00:00Z'),
            },
          });
        }
        break;

      case '리뷰 없음':
        await createDefaultOperatingHours(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        break;

      case '리뷰 잘못된 이미지':
        await createDefaultOperatingHours(place.idx);
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
        await createDefaultOperatingHours(place.idx);
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
        await createDefaultOperatingHours(place.idx);
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
        await createDefaultOperatingHours(place.idx);
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
        await createDefaultOperatingHours(place.idx);
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
        await createDefaultOperatingHours(place.idx);
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
        await createDefaultOperatingHours(place.idx);
        await createDefaultMenu(place.idx);
        await createDefaultPlaceImage(place.idx);
        await createDefaultReview(place.idx, user1.idx);
        await createDefaultPlaceTypeMapping(place.idx);
        break;

      case '장소의 타입이 여러개':
        await createDefaultOperatingHours(place.idx);
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
        await createDefaultOperatingHours(place.idx);
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
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
