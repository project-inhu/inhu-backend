import { DayOfWeek } from '@libs/common/modules/date-util/constants/day-of-week.constants';
import {
  MenuTestCaseInput,
  PlaceSeedData,
  ReviewTestCaseInput,
} from '../constants/type';
import { WeeklyCloseType } from '@libs/core/place/constants/weekly-close-type.constant';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';

const PLACE_IMAGE = {
  BAKERY: '/place/bakery.jpg',
  HOSPITAL: '/place/hospital.jpg',
  MOSCOW: '/place/moscow.jpg',
  PARK: '/place/park.jpg',
  POOL: '/place/pool.jpg',
  SCHOOL: '/place/school.jpg',
  SOCCER_FIELD: '/place/soccer_field.jpg',
  THEATER: '/place/theater.jpg',
  CAFE1: '/place/cafe.jpg',
  BAR1: '/place/bar.jpg',
  BAR2: '/place/bar2.jpg',
  BAR3: '/place/bar3.jpg',
  BAR4: '/place/bar4.jpg',
  BAR5: '/place/bar5.jpg',
  RESTAURANT1: '/place/restaurant.jpeg',
  RESTAURANT2: '/place/restaurant2.jpg',
  RESTAURANT3: '/place/restaurant3.jpg',
};

/**
 * 운영시간과 관련된 재사용될 함수와 상수들
 */
function createDailySchedule(startAt: Date, endAt: Date) {
  const ALL_DAYS: DayOfWeek[] = [
    DayOfWeek.SUN,
    DayOfWeek.MON,
    DayOfWeek.TUE,
    DayOfWeek.WED,
    DayOfWeek.THU,
    DayOfWeek.FRI,
    DayOfWeek.SAT,
  ];
  return ALL_DAYS.map((day) => ({
    day,
    startAt,
    endAt,
  }));
}

// 다양한 운영시간 패턴들
const FULL_OPERATING_HOURS = createDailySchedule(
  new Date('1970-01-01T09:00:00'),
  new Date('1970-01-01T18:00:00'),
);
const CAFE_HOURS = createDailySchedule(
  new Date('1970-01-01T07:00:00'),
  new Date('1970-01-01T22:00:00'),
);
const BAR_HOURS = [
  ...createDailySchedule(
    new Date('1970-01-01T17:00:00'),
    new Date('1970-01-01T23:59:59'),
  ),
  ...createDailySchedule(
    new Date('1970-01-01T00:00:00'),
    new Date('1970-01-01T02:00:00'),
  ),
];
const RESTAURANT_HOURS = createDailySchedule(
  new Date('1970-01-01T11:00:00'),
  new Date('1970-01-01T23:00:00'),
);
const LATE_NIGHT_HOURS = [
  ...createDailySchedule(
    new Date('1970-01-01T18:00:00'),
    new Date('1970-01-01T23:59:59'),
  ),
  ...createDailySchedule(
    new Date('1970-01-01T00:00:00'),
    new Date('1970-01-01T04:00:00'),
  ),
];
const EARLY_MORNING_HOURS = createDailySchedule(
  new Date('1970-01-01T06:00:00'),
  new Date('1970-01-01T15:00:00'),
);
const CONVENIENCE_HOURS = createDailySchedule(
  new Date('1970-01-01T00:00:00'),
  new Date('1970-01-01T23:59:59'),
);
const BRUNCH_HOURS = createDailySchedule(
  new Date('1970-01-01T09:00:00'),
  new Date('1970-01-01T16:00:00'),
);

// 브레이크타임 패턴들
const FULL_BREAK_TIME = createDailySchedule(
  new Date('1970-01-01T12:00:00'),
  new Date('1970-01-01T13:00:00'),
);
const CAFE_BREAK_TIME = createDailySchedule(
  new Date('1970-01-01T15:00:00'),
  new Date('1970-01-01T16:00:00'),
);
const NO_BREAK_TIME: any[] = [];

// 듀얼 운영시간 (점심+저녁 분리 운영)
const DUAL_OPERATING_HOURS_1 = createDailySchedule(
  new Date('1970-01-01T11:00:00'),
  new Date('1970-01-01T15:00:00'),
);

const DUAL_BREAK_TIME_1 = createDailySchedule(
  new Date('1970-01-01T13:00:00'),
  new Date('1970-01-01T14:00:00'),
);

const DUAL_OPERATING_HOURS_2 = createDailySchedule(
  new Date('1970-01-01T17:00:00'),
  new Date('1970-01-01T21:00:00'),
);

const DUAL_BREAK_TIME_2 = createDailySchedule(
  new Date('1970-01-01T18:00:00'),
  new Date('1970-01-01T19:00:00'),
);

/**
 * 반복적으로 사용될 기본 데이터들
 */
const defaultReview: ReviewTestCaseInput = {
  userKey: 'user1',
  content: '기본 리뷰',
  reviewImgList: ['/review/banana.png'],
  keywordIdxList: [1, 2],
};
const defaultMenu: MenuTestCaseInput = {
  name: '기본 메뉴',
  content: '메뉴 설명입니다.',
  price: 10000,
  imagePath: '/menu/buns.jpg',
};
const defaultPickedPlace = {
  title: '에디터 추천 장소',
  content: '이 장소는 에디터가 특별히 추천한 곳이에요.',
};

/**
 * place1 : 메뉴 없음 + pickedPlace 있음
 * - 메뉴 목록이 비어있는 장소를 테스트할 때 사용됨
 */
const place1: PlaceSeedData = {
  name: '메뉴 없음',
  tel: '032-111-0001',
  activatedAt: new Date(),
  placeImgList: [PLACE_IMAGE.HOSPITAL, PLACE_IMAGE.BAKERY],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 1',
    addressX: 126.660511,
    addressY: 37.452188,
  },
  operatingHourList: FULL_OPERATING_HOURS,
  breakTime: FULL_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [],
  pickedPlaceList: [defaultPickedPlace],
};

/**
 * place2 : 메뉴 많음 + pickedPlace 있음
 * - 메뉴가 많아 페이지네이션을 테스트할 때 사용됨
 */
const place2: PlaceSeedData = {
  name: '메뉴 많음',
  tel: '032-111-0002',
  activatedAt: new Date(),
  placeImgList: [PLACE_IMAGE.POOL],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 2',
    addressX: 126.654123,
    addressY: 37.452099,
  },
  operatingHourList: RESTAURANT_HOURS,
  breakTime: FULL_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: Array.from({ length: 12 }, (_, i) => ({
    name: `많은메뉴${i + 1}`,
    content: '많은 메뉴입니다.',
    price: 4000,
    imagePath: '/menu/buns.jpg',
  })),
  pickedPlaceList: [defaultPickedPlace],
};

/**
 * place3 : 메뉴 이미지 없음 + pickedPlace 있음
 * - 메뉴에 이미지가 없는 경우를 테스트할 때 사용됨
 */
const place3: PlaceSeedData = {
  name: '메뉴 이미지 없음',
  tel: '032-111-0003',
  activatedAt: new Date(),
  placeImgList: [PLACE_IMAGE.MOSCOW],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 3',
    addressX: 126.666876,
    addressY: 37.452211,
  },
  operatingHourList: FULL_OPERATING_HOURS,
  breakTime: FULL_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [
    {
      name: '이미지 없는 메뉴',
      content: '이미지가 없는 메뉴입니다.',
      price: 10000,
      imagePath: null,
    },
  ],
  pickedPlaceList: [defaultPickedPlace],
};

/**
 * place4 : 잘못된 메뉴 이미지 + pickedPlace 있음
 * - 메뉴 이미지가 잘못된 경우를 테스트할 때 사용됨
 */
const place4: PlaceSeedData = {
  name: '잘못된 메뉴 이미지',
  tel: '032-111-0004',
  activatedAt: new Date(),
  placeImgList: [PLACE_IMAGE.PARK, PLACE_IMAGE.SCHOOL],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 4',
    addressX: 126.658901,
    addressY: 37.452045,
  },
  operatingHourList: EARLY_MORNING_HOURS,
  breakTime: FULL_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [
    {
      name: '잘못된 이미지 메뉴',
      content: '이미지가 잘못된 메뉴입니다.',
      price: 4000,
      imagePath: 'invalid/path.jpg',
    },
  ],
  pickedPlaceList: [defaultPickedPlace],
};

/**
 * place5 : 싯가 메뉴 있음 + pickedPlace 있음
 * - isFlexible가 true이고 price가 null인 메뉴를 테스트할 때 사용됨
 */
const place5: PlaceSeedData = {
  name: '싯가 메뉴 있음',
  tel: '032-111-0005',
  activatedAt: new Date(),
  placeImgList: [
    PLACE_IMAGE.SCHOOL,
    PLACE_IMAGE.SOCCER_FIELD,
    PLACE_IMAGE.THEATER,
  ],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 5',
    addressX: 126.662345,
    addressY: 37.452155,
  },
  operatingHourList: CONVENIENCE_HOURS,
  breakTime: NO_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [
    {
      name: '싯가 메뉴',
      content: '싯가 메뉴입니다.',
      isFlexible: true,
      price: null,
      imagePath: '/menu/cookies.jpg',
    },
  ],
  pickedPlaceList: [defaultPickedPlace],
};

/**
 * place6 : 리뷰 없음 + pickedPlace 있음
 * - 리뷰가 없는 경우를 테스트할 때 사용됨
 */
const place6: PlaceSeedData = {
  name: '리뷰 없음',
  tel: '032-111-0006',
  activatedAt: new Date(),
  placeImgList: [
    PLACE_IMAGE.THEATER,
    PLACE_IMAGE.SCHOOL,
    PLACE_IMAGE.SOCCER_FIELD,
  ],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 6',
    addressX: 126.655678,
    addressY: 37.452222,
  },
  operatingHourList: LATE_NIGHT_HOURS,
  breakTime: NO_BREAK_TIME,
  reviewList: [],
  menuList: [defaultMenu],
  pickedPlaceList: [defaultPickedPlace],
};

/**
 * place7 : 리뷰 많음 + pickedPlace 있음
 * - 리뷰가 많아 페이지네이션을 테스트할 때 사용됨
 */
const place7: PlaceSeedData = {
  name: '리뷰 많음',
  tel: '032-111-0007',
  activatedAt: new Date(),
  placeImgList: [],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 7',
    addressX: 126.664098,
    addressY: 37.452101,
  },
  operatingHourList: CAFE_HOURS,
  breakTime: CAFE_BREAK_TIME,

  reviewList: [
    {
      userKey: 'user1',
      content: '리뷰가 여러개',
      reviewImgList: ['/review/banana.png'],
      keywordIdxList: [1, 4],
    },
    {
      userKey: 'user1',
      content: '리뷰가 여러개',
      reviewImgList: ['/review/cake.png'],
      keywordIdxList: [1, 4],
    },
    {
      userKey: 'user2',
      content: '리뷰가 여러개',
      reviewImgList: ['/review/chocolate.png'],
      keywordIdxList: [2, 5],
    },
    {
      userKey: 'user1',
      content: '리뷰가 여러개',
      reviewImgList: ['/review/donuts.png'],
      keywordIdxList: [3, 4],
    },
    {
      userKey: 'user2',
      content: '리뷰가 여러개',
      reviewImgList: ['/review/ice-cream.png'],
      keywordIdxList: [1, 5],
    },
    {
      userKey: 'user1',
      content: '리뷰가 여러개',
      reviewImgList: ['/review/banana.png'],
      keywordIdxList: [2, 4],
    },
    {
      userKey: 'user2',
      content: '리뷰가 여러개',
      reviewImgList: ['/review/cake.png'],
      keywordIdxList: [3, 5],
    },
    {
      userKey: 'user1',
      content: '리뷰가 여러개',
      reviewImgList: ['/review/chocolate.png'],
      keywordIdxList: [1, 4, 5],
    },
    {
      userKey: 'user2',
      content: '리뷰가 여러개',
      reviewImgList: ['/review/donuts.png'],
      keywordIdxList: [2],
    },
    {
      userKey: 'user1',
      content: '리뷰가 여러개',
      reviewImgList: ['/review/ice-cream.png'],
      keywordIdxList: [3],
    },
    {
      userKey: 'user2',
      content: '리뷰가 여러개',
      reviewImgList: ['/review/banana.png'],
      keywordIdxList: [1, 4, 5],
    },
  ],
  menuList: [defaultMenu],
  pickedPlaceList: [defaultPickedPlace],
};

/**
 * place8 : 리뷰 이미지 없음 + pickedPlace 있음
 * - 이미지가 없는 리뷰를 테스트할 때 사용됨
 */
const place8: PlaceSeedData = {
  name: '리뷰 이미지 없음',
  tel: '032-111-0008',
  activatedAt: new Date(),
  placeImgList: [PLACE_IMAGE.CAFE1, PLACE_IMAGE.CAFE1, PLACE_IMAGE.CAFE1],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 8',
    addressX: 126.657754,
    addressY: 37.452087,
  },
  operatingHourList: BRUNCH_HOURS,
  breakTime: NO_BREAK_TIME,
  reviewList: [
    {
      userKey: 'user1',
      content: '리뷰 이미지 없음',
      reviewImgList: null,
      keywordIdxList: [1, 2],
    },
  ],
  menuList: [defaultMenu],
  pickedPlaceList: [defaultPickedPlace],
};

/**
 * place9 : 리뷰 이미지 많음 + pickedPlace 있음
 * - 이미지가 많은 리뷰를 테스트할 때 사용됨
 */
const place9: PlaceSeedData = {
  name: '리뷰 이미지 많음',
  tel: '032-111-0009',
  activatedAt: new Date(),
  placeImgList: [PLACE_IMAGE.POOL, PLACE_IMAGE.SCHOOL],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 9',
    addressX: 126.661122,
    addressY: 37.452198,
  },
  operatingHourList: RESTAURANT_HOURS,
  breakTime: FULL_BREAK_TIME,
  reviewList: [
    {
      userKey: 'user1',
      content: '리뷰 이미지가 많습니다.',
      reviewImgList: [
        '/review/banana.png',
        '/review/chocolate.png',
        '/review/donuts.png',
        '/review/ice-cream.png',
        '/review/cake.png',
      ],
      keywordIdxList: [1, 2],
    },
  ],
  menuList: [defaultMenu],
  pickedPlaceList: [defaultPickedPlace],
};

/**
 * place10 : 잘못된 리뷰 이미지 + pickedPlace 있음
 * - 리뷰 이미지가 잘못된 경우를 테스트할 때 사용됨
 */
const place10: PlaceSeedData = {
  name: '잘못된 리뷰 이미지',
  tel: '032-111-0010',
  type: PlaceType.BAR,
  activatedAt: new Date(),
  placeImgList: [PLACE_IMAGE.BAR1],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 10',
    addressX: 126.665432,
    addressY: 37.452033,
  },
  operatingHourList: BAR_HOURS,
  breakTime: NO_BREAK_TIME,
  reviewList: [
    {
      userKey: 'user1',
      content: '리뷰 이미지가 잘못되었습니다.',
      reviewImgList: ['invalid-review-image.jpg'],
      keywordIdxList: [1, 2],
    },
  ],
  menuList: [defaultMenu],
  pickedPlaceList: [defaultPickedPlace],
};

/**
 * place11 : 리뷰 키워드 없음 + pickedPlace 있음
 * - 리뷰 키워드가 없는 경우를 테스트할 때 사용됨
 */
const place11: PlaceSeedData = {
  name: '리뷰 키워드 없음',
  tel: '032-111-0011',
  activatedAt: new Date(),
  type: PlaceType.RESTAURANT,
  placeImgList: [PLACE_IMAGE.RESTAURANT1, PLACE_IMAGE.RESTAURANT2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 11',
    addressX: 126.65389,
    addressY: 37.452176,
  },
  operatingHourList: CONVENIENCE_HOURS,
  breakTime: NO_BREAK_TIME,
  keywordCountList: [],
  reviewList: [
    {
      userKey: 'user1',
      content: '리뷰 키워드가 없습니다.',
      reviewImgList: ['/review/banana.png'],
      keywordIdxList: null,
    },
  ],
  menuList: [defaultMenu],
  pickedPlaceList: [defaultPickedPlace],
};

/**
 * place12 : 리뷰 키워드 많음
 * - 리뷰 키워드가 많은 경우를 테스트할 때 사용됨
 */
const place12: PlaceSeedData = {
  name: '리뷰 키워드 많음',
  tel: '032-111-0012',
  activatedAt: new Date(),
  type: PlaceType.RESTAURANT,
  placeImgList: [PLACE_IMAGE.RESTAURANT2, PLACE_IMAGE.RESTAURANT1],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 12',
    addressX: 126.666012,
    addressY: 37.452021,
  },
  operatingHourList: EARLY_MORNING_HOURS,
  breakTime: FULL_BREAK_TIME,
  reviewList: [
    {
      userKey: 'user1',
      content: '리뷰 키워드가 5개 있습니다.',
      reviewImgList: ['/review/banana.png'],
      keywordIdxList: [1, 2, 3, 4, 5],
    },
  ],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place13 : 장소 이미지 많음
 * - 장소 이미지가 많은 경우를 테스트할 때 사용됨
 */
const place13: PlaceSeedData = {
  name: '장소 이미지 많음',
  tel: '032-111-0013',
  activatedAt: new Date(),
  placeImgList: [
    PLACE_IMAGE.BAKERY,
    PLACE_IMAGE.BAR1,
    PLACE_IMAGE.HOSPITAL,
    PLACE_IMAGE.POOL,
    PLACE_IMAGE.THEATER,
  ],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 13',
    addressX: 126.659876,
    addressY: 37.452205,
  },
  operatingHourList: LATE_NIGHT_HOURS,
  breakTime: NO_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place14 : 잘못된 장소 이미지
 * - 장소 이미지가 잘못된 경우를 테스트할 때 사용됨
 */
const place14: PlaceSeedData = {
  name: '잘못된 장소 이미지',
  tel: '032-111-0014',
  activatedAt: new Date(),
  placeImgList: ['invalid-place-path'],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 14',
    addressX: 126.66321,
    addressY: 37.452112,
  },
  operatingHourList: FULL_OPERATING_HOURS,
  breakTime: FULL_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place15 : 운영시간 없음
 * - 운영시간이 없는 경우를 테스트할 때 사용됨
 */
const place15: PlaceSeedData = {
  name: '운영시간 없음',
  tel: '032-111-0015',
  activatedAt: new Date(),
  type: PlaceType.RESTAURANT,
  placeImgList: [PLACE_IMAGE.RESTAURANT1],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 15',
    addressX: 126.656543,
    addressY: 37.452076,
  },
  operatingHourList: [],
  breakTime: [],
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place16 : 브레이크 시간 없음
 * - 브레이크 시간이 없는 경우를 테스트할 때 사용됨
 */
const place16: PlaceSeedData = {
  name: '브레이크 시간 없음',
  tel: '032-111-0016',
  activatedAt: new Date(),
  type: PlaceType.BAR,
  placeImgList: [PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 16',
    addressX: 126.664876,
    addressY: 37.452143,
  },
  operatingHourList: BAR_HOURS,
  breakTime: [],
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place17 : 정기 휴무일 있음
 * - 매주 특정 요일 (ex: 토요일)에 휴무인 경우를 테스트할 때 사용됨
 */
const place17: PlaceSeedData = {
  name: '정기 휴무일 있음',
  tel: '032-111-0017',
  activatedAt: new Date(),
  type: PlaceType.BAR,
  placeImgList: [PLACE_IMAGE.BAR3, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 17',
    addressX: 126.658234,
    addressY: 37.452065,
  },
  operatingHourList: BAR_HOURS.filter((h) => h.day !== DayOfWeek.SAT),
  breakTime: CAFE_BREAK_TIME.filter((b) => b.day !== DayOfWeek.SAT),
  closedDayList: [
    { day: DayOfWeek.SAT, week: 1 },
    { day: DayOfWeek.SAT, week: 2 },
    { day: DayOfWeek.SAT, week: 3 },
    { day: DayOfWeek.SAT, week: 4 },
    { day: DayOfWeek.SAT, week: 5 },
    { day: DayOfWeek.SAT, week: 6 },
  ],
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place18 : 운영시간/브레이크 2번
 * - 하루에 운영시간과 브레이크 시간이 2번 있는 경우를 테스트할 때 사용됨
 */
const place18: PlaceSeedData = {
  name: '운영시간/브레이크 2번',
  tel: '032-111-0018',
  activatedAt: new Date(),
  type: PlaceType.BAR,
  placeImgList: [PLACE_IMAGE.BAR4, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 18',
    addressX: 126.662987,
    addressY: 37.452167,
  },
  operatingHourList: [...DUAL_OPERATING_HOURS_1, ...DUAL_OPERATING_HOURS_2],
  breakTime: [...DUAL_BREAK_TIME_1, ...DUAL_BREAK_TIME_2],
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place19 : 매월 특정 주차의 특정 요일 휴무
 * - 매월 특정 주차(예: 2,4)의 특정 요일(예:화요일)에 휴무인 경우를 테스트할 때 사용됨
 */
const place19: PlaceSeedData = {
  name: '매월 특정 주차의 특정 요일 휴무',
  tel: '032-111-0019',
  activatedAt: new Date(),
  type: PlaceType.BAR,
  placeImgList: [PLACE_IMAGE.BAR5, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 19',
    addressX: 126.654999,
    addressY: 37.452189,
  },
  closedDayList: [
    { day: DayOfWeek.TUE, week: 2 },
    { day: DayOfWeek.TUE, week: 4 },
  ],
  operatingHourList: BAR_HOURS,
  breakTime: NO_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place20 : 격주 휴무
 * - 특정 날짜를 기준으로 격주로 휴무인 경우를 테스트할 때 사용됨
 */
const place20: PlaceSeedData = {
  name: '격주 휴무',
  tel: '032-111-0020',
  activatedAt: new Date(),
  type: PlaceType.RESTAURANT,
  placeImgList: [PLACE_IMAGE.RESTAURANT2, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 20',
    addressX: 126.665111,
    addressY: 37.452054,
  },
  weeklyClosedDayList: [
    {
      closedDate: new Date('2025-07-02T00:00:00Z'),
      type: WeeklyCloseType.BIWEEKLY,
    },
  ],
  operatingHourList: FULL_OPERATING_HOURS,
  breakTime: FULL_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place21 : 공휴일 휴무
 * - 공휴일에 휴무인 경우를 테스트할 때 사용됨
 */
const place21: PlaceSeedData = {
  name: '공휴일 휴무',
  tel: '032-111-0021',
  activatedAt: new Date(),
  type: PlaceType.BAR,
  placeImgList: [PLACE_IMAGE.BAR5, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 21',
    addressX: 126.660001,
    addressY: 37.452231,
  },
  isClosedOnHoliday: true,
  operatingHourList: BAR_HOURS,
  breakTime: NO_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place22 : 전화번호 없음
 * - 전화번호가 없는 경우를 테스트할 때 사용됨
 */
const place22: PlaceSeedData = {
  name: '전화번호 없음',
  tel: null,
  activatedAt: new Date(),
  type: PlaceType.RESTAURANT,
  placeImgList: [PLACE_IMAGE.RESTAURANT3, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 22',
    addressX: 126.65701,
    addressY: 37.452048,
  },
  operatingHourList: FULL_OPERATING_HOURS,
  breakTime: FULL_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place23 : 비활성화된 장소
 * - 비활성화된 장소를 테스트할 때 사용됨
 * - 비활성화된 장소만 보기 테스트
 */
const place23: PlaceSeedData = {
  name: '비활성화된 장소',
  tel: '032-111-0022',
  activatedAt: null,
  type: PlaceType.RESTAURANT,
  placeImgList: [PLACE_IMAGE.RESTAURANT2, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 23',
    addressX: 126.663852,
    addressY: 37.452132,
  },
  operatingHourList: FULL_OPERATING_HOURS,
  breakTime: FULL_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place24 : 상세 주소 존재함
 * - 상세 주소가 존재하는 경우를 테스트할 때 사용됨
 */
const place24: PlaceSeedData = {
  name: '상세 주소 존재함',
  tel: '032-111-0023',
  activatedAt: new Date(),
  type: PlaceType.RESTAURANT,
  placeImgList: [PLACE_IMAGE.RESTAURANT3, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 24',
    addressX: 126.656032,
    addressY: 37.452091,
    detail: '인하대학교 학생회관 1층',
  },
  operatingHourList: FULL_OPERATING_HOURS,
  breakTime: FULL_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place25 : 미래에 활성화될 장소
 * - 미래에 활성화될 장소를 테스트할 때 사용됨
 * - 이 시딩 파일이 실행된 시점으로부터 1일 후에 활성화됨
 */
const place25: PlaceSeedData = {
  name: '미래에 활성화될 장소',
  tel: '032-111-0024',
  activatedAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1일 후 활성화
  type: PlaceType.RESTAURANT,
  placeImgList: [PLACE_IMAGE.RESTAURANT2, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 25',
    addressX: 126.661789,
    addressY: 37.452178,
  },
  operatingHourList: CAFE_HOURS,
  breakTime: CAFE_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place26: 삭제된 장소 + 비활성화
 * - 소프트 삭제된 장소를 테스트할 때 사용됨
 * - 일반적인 API 조회 결과에 포함되면 안됨
 */
const place26: PlaceSeedData = {
  name: '삭제된 장소',
  tel: '032-111-0025',
  deletedAt: new Date(),
  type: PlaceType.RESTAURANT,
  placeImgList: [PLACE_IMAGE.RESTAURANT2, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 26',
    addressX: 126.665902,
    addressY: 37.452029,
  },
  operatingHourList: FULL_OPERATING_HOURS,
  breakTime: FULL_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place27: 폐업한 장소 + 비활성화
 * - 폐업 상태의 장소를 테스트할 때 사용됨
 * - 이 장소는 특정 필터링을 통해 조회될 수는 있지만, 기본 조회 결과에는 포함되면 안됨
 */

const place27: PlaceSeedData = {
  name: '폐업한 장소',
  tel: '032-111-0026',
  permanentlyClosedAt: new Date(),
  type: PlaceType.RESTAURANT,
  placeImgList: [PLACE_IMAGE.MOSCOW, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 27',
    addressX: 126.659147,
    addressY: 37.452215,
  },
  operatingHourList: FULL_OPERATING_HOURS,
  breakTime: FULL_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place28: 삭제된 리뷰가 포함된 장소
 * - 리뷰 중 하나가 삭제된 경우를 테스트할 때 사용됨
 * - 이 장소의 reviewCount는 1이며, 삭제된 리뷰는 조회되지 않아야 함
 */
const place28: PlaceSeedData = {
  name: '삭제된 리뷰가 포함된 장소',
  tel: '032-111-0027',
  activatedAt: new Date(),
  type: PlaceType.RESTAURANT,
  placeImgList: [PLACE_IMAGE.BAR5, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 28',
    addressX: 126.662054,
    addressY: 37.452121,
  },
  operatingHourList: FULL_OPERATING_HOURS,
  breakTime: FULL_BREAK_TIME,
  reviewList: [
    defaultReview,
    {
      userKey: 'user2',
      content: '삭제된 리뷰입니다.',
      reviewImgList: ['/review/banana.png'],
      keywordIdxList: [1, 2],
      deletedAt: new Date(),
    },
  ],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place29: 삭제된 메뉴가 포함된 장소
 * - 메뉴 중 하나가 삭제된 경우를 테스트할 때 사용됨
 * - 이 장소의 메뉴 목록을 조회하면 삭제된 메뉴는 제외되어야 함
 */
const place29: PlaceSeedData = {
  name: '삭제된 메뉴가 포함된 장소',
  tel: '032-111-0028',
  activatedAt: new Date(),
  placeImgList: ['/place/bakery.jpg'],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 29',
    addressX: 126.655215,
    addressY: 37.452082,
  },
  operatingHourList: FULL_OPERATING_HOURS,
  breakTime: FULL_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [
    defaultMenu,
    {
      name: '삭제된 메뉴',
      content: '삭제된 메뉴입니다.',
      price: 5000,
      imagePath: '/menu/buns.jpg',
      deletedAt: new Date(),
    },
  ],
  pickedPlaceList: [],
};

/**
 * 생성한 모든 데이터를 묶어서 하나의 배열로 export
 */
export const PlaceSeedDataList = [
  place1,
  place2,
  place3,
  place4,
  place5,
  place6,
  place7,
  place8,
  place9,
  place10,
  place11,
  place12,
  place13,
  place14,
  place15,
  place16,
  place17,
  place18,
  place19,
  place20,
  place21,
  place22,
  place23,
  place24,
  place25,
  place26,
  place27,
  place28,
  place29,
];
