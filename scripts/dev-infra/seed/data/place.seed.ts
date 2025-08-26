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

const FIXED_ACTIVATED_AT = new Date('2025-08-21T00:00:00');

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
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.HOSPITAL, PLACE_IMAGE.BAKERY],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 101',
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
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.POOL],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 102',
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
  type: PlaceType.CAFE,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.MOSCOW],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 103',
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
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.PARK, PLACE_IMAGE.SCHOOL],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 104',
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
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [
    PLACE_IMAGE.SCHOOL,
    PLACE_IMAGE.SOCCER_FIELD,
    PLACE_IMAGE.THEATER,
  ],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 105',
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
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [
    PLACE_IMAGE.THEATER,
    PLACE_IMAGE.SCHOOL,
    PLACE_IMAGE.SOCCER_FIELD,
  ],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 106',
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
  type: PlaceType.CAFE,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 107',
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
  type: PlaceType.CAFE,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.CAFE1, PLACE_IMAGE.CAFE1, PLACE_IMAGE.CAFE1],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 108',
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
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.POOL, PLACE_IMAGE.SCHOOL],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 109',
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
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.BAR1],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 110',
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
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.RESTAURANT1, PLACE_IMAGE.RESTAURANT2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 111',
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
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.RESTAURANT2, PLACE_IMAGE.RESTAURANT1],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 112',
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
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [
    PLACE_IMAGE.BAKERY,
    PLACE_IMAGE.BAR1,
    PLACE_IMAGE.HOSPITAL,
    PLACE_IMAGE.POOL,
    PLACE_IMAGE.THEATER,
  ],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 113',
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
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: ['invalid-place-path'],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 114',
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
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.RESTAURANT1],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 115',
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
  type: PlaceType.BAR,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 116',
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
 * place17 : 월요일 정기 휴무
 * - 매주 월요일이 휴무인 경우를 테스트할 때 사용됨
 */
const place17: PlaceSeedData = {
  name: '월요일 정기 휴무',
  tel: '032-111-0017',
  type: PlaceType.BAR,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.BAR3, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 117',
    addressX: 126.658234,
    addressY: 37.452065,
  },
  operatingHourList: BAR_HOURS.filter((h) => h.day !== DayOfWeek.MON),
  breakTime: NO_BREAK_TIME,
  closedDayList: [
    { day: DayOfWeek.MON, week: 1 },
    { day: DayOfWeek.MON, week: 2 },
    { day: DayOfWeek.MON, week: 3 },
    { day: DayOfWeek.MON, week: 4 },
    { day: DayOfWeek.MON, week: 5 },
    { day: DayOfWeek.MON, week: 6 },
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
  type: PlaceType.BAR,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.BAR4, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 118',
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
  type: PlaceType.BAR,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.BAR5, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 119',
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
 * - 실행 날짜를 기준으로 격주로 휴무인 경우를 테스트할 때 사용됨
 */
const place20: PlaceSeedData = {
  name: '격주 휴무',
  tel: '032-111-0020',
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.RESTAURANT2, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 120',
    addressX: 126.665111,
    addressY: 37.452054,
  },
  weeklyClosedDayList: [
    {
      closedDate: new Date(),
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
  type: PlaceType.BAR,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.BAR5, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 121',
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
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.RESTAURANT3, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 122',
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
    name: '인천광역시 미추홀구 인하로 123',
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
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.RESTAURANT3, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 124',
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
    name: '인천광역시 미추홀구 인하로 125',
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
  type: PlaceType.RESTAURANT,
  deletedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.RESTAURANT2, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 126',
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
  type: PlaceType.RESTAURANT,
  permanentlyClosedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.MOSCOW, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 127',
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
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.BAR5, PLACE_IMAGE.BAR2],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 128',
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
      deletedAt: FIXED_ACTIVATED_AT,
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
  type: PlaceType.CAFE,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: ['/place/bakery.jpg'],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 129',
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
      deletedAt: FIXED_ACTIVATED_AT,
    },
  ],
  pickedPlaceList: [],
};

/**
 * place30: 요일마다 운영시간/브레이크 타임이 모두 다른 장소
 * - 복잡한 운영시간 필터링을 테스트할 때 사용됨
 */
const place30: PlaceSeedData = {
  name: '요일마다 운영시간 다름',
  tel: '032-111-0030',
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.RESTAURANT1],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 130',
    addressX: 126.654518,
    addressY: 37.451535,
  },
  operatingHourList: [
    {
      day: DayOfWeek.MON,
      startAt: new Date('1970-01-01T09:00:00'),
      endAt: new Date('1970-01-01T22:00:00'),
    },
    {
      day: DayOfWeek.TUE,
      startAt: new Date('1970-01-01T09:00:00'),
      endAt: new Date('1970-01-01T22:00:00'),
    },
    {
      day: DayOfWeek.WED,
      startAt: new Date('1970-01-01T10:00:00'),
      endAt: new Date('1970-01-01T21:00:00'),
    },
    {
      day: DayOfWeek.THU,
      startAt: new Date('1970-01-01T10:00:00'),
      endAt: new Date('1970-01-01T21:00:00'),
    },
    {
      day: DayOfWeek.FRI,
      startAt: new Date('1970-01-01T09:00:00'),
      endAt: new Date('1970-01-01T23:00:00'),
    },
    {
      day: DayOfWeek.SAT,
      startAt: new Date('1970-01-01T11:00:00'),
      endAt: new Date('1970-01-01T23:00:00'),
    },
    {
      day: DayOfWeek.SUN,
      startAt: new Date('1970-01-01T11:00:00'),
      endAt: new Date('1970-01-01T20:00:00'),
    },
  ],
  breakTime: [
    {
      day: DayOfWeek.MON,
      startAt: new Date('1970-01-01T15:00:00'),
      endAt: new Date('1970-01-01T17:00:00'),
    },
    {
      day: DayOfWeek.TUE,
      startAt: new Date('1970-01-01T15:00:00'),
      endAt: new Date('1970-01-01T17:00:00'),
    },
    {
      day: DayOfWeek.WED,
      startAt: new Date('1970-01-01T15:00:00'),
      endAt: new Date('1970-01-01T17:00:00'),
    },
    {
      day: DayOfWeek.THU,
      startAt: new Date('1970-01-01T15:00:00'),
      endAt: new Date('1970-01-01T17:00:00'),
    },
  ],
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place31 : 화요일 정기 휴무
 * - 매주 화요일이 휴무인 경우를 테스트할 때 사용됨
 */
const place31: PlaceSeedData = {
  name: '화요일 정기 휴무',
  tel: '032-111-0031',
  type: PlaceType.CAFE,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.HOSPITAL],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 131',
    addressX: 126.6539,
    addressY: 37.4519,
  },
  operatingHourList: CAFE_HOURS.filter((h) => h.day !== DayOfWeek.TUE),
  breakTime: CAFE_BREAK_TIME.filter((b) => b.day !== DayOfWeek.TUE),
  closedDayList: [
    { day: DayOfWeek.TUE, week: 1 },
    { day: DayOfWeek.TUE, week: 2 },
    { day: DayOfWeek.TUE, week: 3 },
    { day: DayOfWeek.TUE, week: 4 },
    { day: DayOfWeek.TUE, week: 5 },
    { day: DayOfWeek.TUE, week: 6 },
  ],
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place32 : 수요일 정기 휴무
 * - 매주 수요일이 휴무인 경우를 테스트할 때 사용됨
 */
const place32: PlaceSeedData = {
  name: '수요일 정기 휴무',
  tel: '032-111-0032',
  type: PlaceType.BAR,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.HOSPITAL],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 132',
    addressX: 126.6542,
    addressY: 37.4505,
  },
  operatingHourList: BAR_HOURS.filter((h) => h.day !== DayOfWeek.WED),
  breakTime: NO_BREAK_TIME.filter((b) => b.day !== DayOfWeek.WED),
  closedDayList: [
    { day: DayOfWeek.WED, week: 1 },
    { day: DayOfWeek.WED, week: 2 },
    { day: DayOfWeek.WED, week: 3 },
    { day: DayOfWeek.WED, week: 4 },
    { day: DayOfWeek.WED, week: 5 },
    { day: DayOfWeek.WED, week: 6 },
  ],
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place33 : 목요일 정기 휴무
 * - 매주 목요일이 휴무인 경우를 테스트할 때 사용됨
 */
const place33: PlaceSeedData = {
  name: '목요일 정기 휴무',
  tel: '032-111-0033',
  type: PlaceType.CAFE,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.BAKERY],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 133',
    addressX: 126.6581,
    addressY: 37.4531,
  },
  operatingHourList: BRUNCH_HOURS.filter((h) => h.day !== DayOfWeek.THU),
  breakTime: NO_BREAK_TIME,
  closedDayList: [
    { day: DayOfWeek.THU, week: 1 },
    { day: DayOfWeek.THU, week: 2 },
    { day: DayOfWeek.THU, week: 3 },
    { day: DayOfWeek.THU, week: 4 },
    { day: DayOfWeek.THU, week: 5 },
    { day: DayOfWeek.THU, week: 6 },
  ],
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place34 : 금요일 정기 휴무
 * - 매주 금요일이 휴무인 경우를 테스트할 때 사용됨
 */
const place34: PlaceSeedData = {
  name: '금요일 정기 휴무',
  tel: '032-111-0034',
  type: PlaceType.BAR,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.BAR4, PLACE_IMAGE.BAR5],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 134',
    addressX: 126.6548,
    addressY: 37.4525,
  },
  operatingHourList: LATE_NIGHT_HOURS.filter((h) => h.day !== DayOfWeek.FRI),
  breakTime: NO_BREAK_TIME,
  closedDayList: [
    { day: DayOfWeek.FRI, week: 1 },
    { day: DayOfWeek.FRI, week: 2 },
    { day: DayOfWeek.FRI, week: 3 },
    { day: DayOfWeek.FRI, week: 4 },
    { day: DayOfWeek.FRI, week: 5 },
    { day: DayOfWeek.FRI, week: 6 },
  ],
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place35 : 토요일 정기 휴무
 * - 매주 토요일이 휴무인 경우를 테스트할 때 사용됨
 */
const place35: PlaceSeedData = {
  name: '토요일 정기 휴무',
  tel: '032-111-0035',
  type: PlaceType.CAFE,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.CAFE1],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 135',
    addressX: 126.6563,
    addressY: 37.4533,
  },
  operatingHourList: CAFE_HOURS.filter((h) => h.day !== DayOfWeek.SAT),
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
 * place36 : 일요일 정기 휴무
 * - 매주 일요일이 휴무인 경우를 테스트할 때 사용됨
 */
const place36: PlaceSeedData = {
  name: '일요일 정기 휴무',
  tel: '032-111-0036',
  type: PlaceType.RESTAURANT,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.RESTAURANT3],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 136',
    addressX: 126.6568,
    addressY: 37.4538,
  },
  operatingHourList: EARLY_MORNING_HOURS.filter((h) => h.day !== DayOfWeek.SUN),
  breakTime: FULL_BREAK_TIME.filter((b) => b.day !== DayOfWeek.SUN),
  closedDayList: [
    { day: DayOfWeek.SUN, week: 1 },
    { day: DayOfWeek.SUN, week: 2 },
    { day: DayOfWeek.SUN, week: 3 },
    { day: DayOfWeek.SUN, week: 4 },
    { day: DayOfWeek.SUN, week: 5 },
    { day: DayOfWeek.SUN, week: 6 },
  ],
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place37 : 격주 휴무2
 * - 실행 날짜를 기준으로 격주로 휴무인 경우를 테스트할 때 사용됨
 */
const place37: PlaceSeedData = {
  name: '격주 휴무2',
  tel: '032-111-0037',
  type: PlaceType.CAFE,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.CAFE1, PLACE_IMAGE.BAKERY],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 137',
    addressX: 126.6571,
    addressY: 37.4541,
  },
  weeklyClosedDayList: [
    {
      closedDate: new Date(),
      type: WeeklyCloseType.BIWEEKLY,
    },
  ],
  operatingHourList: CAFE_HOURS,
  breakTime: CAFE_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [defaultMenu],
  pickedPlaceList: [],
};

/**
 * place38 : 격주 휴무3
 * - 실행 날짜를 기준으로 격주로 휴무인 경우를 테스트할 때 사용됨
 */
const place38: PlaceSeedData = {
  name: '격주 휴무3',
  tel: '032-111-0038',
  type: PlaceType.CAFE,
  activatedAt: FIXED_ACTIVATED_AT,
  placeImgList: [PLACE_IMAGE.CAFE1, PLACE_IMAGE.BAKERY],
  roadAddress: {
    name: '인천광역시 미추홀구 인하로 138',
    addressX: 126.66033,
    addressY: 37.45213,
  },
  weeklyClosedDayList: [
    {
      closedDate: new Date(),
      type: WeeklyCloseType.BIWEEKLY,
    },
  ],
  operatingHourList: CAFE_HOURS,
  breakTime: CAFE_BREAK_TIME,
  reviewList: [defaultReview],
  menuList: [defaultMenu],
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
  place30,
  place31,
  place32,
  place33,
  place34,
  place35,
  place36,
  place37,
  place38,
];
