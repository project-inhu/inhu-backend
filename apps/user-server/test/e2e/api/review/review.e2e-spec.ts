import { PlaceSeedHelper, ReviewSeedHelper } from '@libs/testing';
import { GetAllReviewResponseDto } from '@user/api/review/dto/response/get-all-review.response.dto';
import { ReviewEntity } from '@user/api/review/entity/review.entity';
import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('Review E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const reviewSeedHelper = testHelper.seedHelper(ReviewSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /review/all', () => {
    it('200 - review field check', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
        roadAddress: {
          name: '서울시 강남구 테헤란로 123',
          detail: '테헤란로 123',
        },
      });

      const reviewSeed = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
          '/review/f994f6ad-c42f-4c29-86db-d391fe450b1f-20250719.jpg',
        ],
        keywordIdxList: [1, 2],
      });

      const response = await testHelper
        .test()
        .get('/review/all')
        .query({
          placeIdx: place.idx,
          page: 1,
        })
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const body: GetAllReviewResponseDto = response.body;

      const { reviewList } = body;

      const resultReview = reviewList[0];

      const user = await testHelper.getPrisma().user.findUniqueOrThrow({
        where: { idx: loginUser.idx },
      });

      expect(resultReview.idx).toBe(reviewSeed.idx);
      expect(resultReview.content).toBe(reviewSeed.content);
      expect(resultReview.imagePathList.sort()).toStrictEqual(
        (reviewSeed.reviewImgList || [])?.sort(),
      );
      expect(
        resultReview.keywordList.map(({ idx }) => idx).sort(),
      ).toStrictEqual((reviewSeed.keywordIdxList || [])?.sort());
      expect(resultReview.place.idx).toBe(place.idx);
      expect(resultReview.place.name).toBe(place.name);
      expect(resultReview.place.roadAddress.name).toBe(place.roadAddress.name);
      expect(resultReview.place.roadAddress.detail).toBe(
        place.roadAddress.detail,
      );
      expect(resultReview.place.roadAddress.addressX).toBe(
        place.roadAddress.addressX,
      );
      expect(resultReview.place.roadAddress.addressY).toBe(
        place.roadAddress.addressY,
      );
      expect(resultReview.author.idx).toBe(loginUser.idx);
      expect(resultReview.author.nickname).toBe(user.nickname);
      expect(resultReview.author.profileImagePath).toBe(user.profileImagePath);
    });

    it('200 - hasNext check', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      // placeIdx가 place.idx인 리뷰 10개 생성
      await reviewSeedHelper.seedAll(
        Array.from({ length: 10 }, () => ({
          placeIdx: place.idx,
          userIdx: loginUser.idx,
        })),
      );

      const response = await testHelper
        .test()
        .get('/review/all')
        .query({
          placeIdx: place.idx,
          page: 1,
        })
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const body: GetAllReviewResponseDto = response.body;

      expect(body.hasNext).toBe(false);

      // 10개에서 하나 더 넣기
      await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
      });

      const response2 = await testHelper
        .test()
        .get('/review/all')
        .query({
          placeIdx: place.idx,
          page: 1,
        })
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      expect(response2.body.hasNext).toBe(true);
    });

    it('200 - sort order check', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const firstReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
      });

      // 시간 간격을 두어 생성 순서를 명확히 함
      await new Promise((resolve) => setTimeout(resolve, 20));

      const secondReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
      });

      const response = await testHelper
        .test()
        .get('/review/all')
        .query({ placeIdx: place.idx, page: 1 })
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const { reviewList }: GetAllReviewResponseDto = response.body;

      expect(reviewList[0].idx).toBe(secondReview.idx);
      expect(reviewList[1].idx).toBe(firstReview.idx);
    });

    it('200 - soft delete check', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      // 삭제된 리뷰 생성
      await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        deletedAt: new Date(),
      });

      const reviewToKeep = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
      });

      const response = await testHelper
        .test()
        .get('/review/all')
        .query({ placeIdx: place.idx, page: 1 })
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const { reviewList }: GetAllReviewResponseDto = response.body;

      expect(reviewList[0].idx).toBe(reviewToKeep.idx);
    });

    it('200 - place idx filtering check', async () => {
      const reviewAuthor = testHelper.loginUsers.user1;

      const [firstPlace, secondPlace] = await placeSeedHelper.seedAll([
        { deletedAt: null, activatedAt: new Date() },
        { deletedAt: null, activatedAt: new Date() },
      ]);

      const [
        review1OfFirstPlace,
        review2OfFirstPlace,
        review3OfSecondPlace,
        review4OfSecondPlace,
      ] = await reviewSeedHelper.seedAll([
        { placeIdx: firstPlace.idx, userIdx: reviewAuthor.idx },
        { placeIdx: firstPlace.idx, userIdx: reviewAuthor.idx },
        { placeIdx: secondPlace.idx, userIdx: reviewAuthor.idx },
        { placeIdx: secondPlace.idx, userIdx: reviewAuthor.idx },
      ]);

      const firstPlaceResponse = await testHelper
        .test()
        .get('/review/all')
        .query({
          placeIdx: firstPlace.idx,
          page: 1,
        })
        .set('Authorization', `Bearer ${reviewAuthor.app.accessToken}`)
        .expect(200);

      const reviewsOfFirstPlace = (
        firstPlaceResponse.body as GetAllReviewResponseDto
      ).reviewList;

      expect(reviewsOfFirstPlace.map(({ idx }) => idx).sort()).toStrictEqual(
        [review1OfFirstPlace.idx, review2OfFirstPlace.idx].sort(),
      );

      const secondPlaceResponse = await testHelper
        .test()
        .get('/review/all')
        .query({
          placeIdx: secondPlace.idx,
          page: 1,
        })
        .set('Authorization', `Bearer ${reviewAuthor.app.accessToken}`)
        .expect(200);

      const reviewsOfSecondPlace = (
        secondPlaceResponse.body as GetAllReviewResponseDto
      ).reviewList;

      expect(reviewsOfSecondPlace.map(({ idx }) => idx).sort()).toStrictEqual(
        [review3OfSecondPlace.idx, review4OfSecondPlace.idx].sort(),
      );
    });

    it('200 - user idx filtering check', async () => {
      const firstUser = testHelper.loginUsers.user1;
      const secondUser = testHelper.loginUsers.user2;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const [
        review1OfFirstUser,
        review2OfFirstUser,
        review3OfSecondUser,
        review4OfSecondUser,
      ] = await reviewSeedHelper.seedAll([
        { placeIdx: place.idx, userIdx: firstUser.idx },
        { placeIdx: place.idx, userIdx: firstUser.idx },
        { placeIdx: place.idx, userIdx: secondUser.idx },
        { placeIdx: place.idx, userIdx: secondUser.idx },
      ]);

      const firstUserResponse = await testHelper
        .test()
        .get('/review/all')
        .query({
          userIdx: firstUser.idx,
          page: 1,
        })
        .set('Authorization', `Bearer ${firstUser.app.accessToken}`)
        .expect(200);

      const reviewsOfFirstUser = (
        firstUserResponse.body as GetAllReviewResponseDto
      ).reviewList;

      expect(reviewsOfFirstUser.map(({ idx }) => idx).sort()).toStrictEqual(
        [review1OfFirstUser.idx, review2OfFirstUser.idx].sort(),
      );

      const secondUserResponse = await testHelper
        .test()
        .get('/review/all')
        .query({
          userIdx: secondUser.idx,
          page: 1,
        })
        .set('Authorization', `Bearer ${secondUser.app.accessToken}`)
        .expect(200);

      const reviewsOfSecondUser = (
        secondUserResponse.body as GetAllReviewResponseDto
      ).reviewList;

      expect(reviewsOfSecondUser.map(({ idx }) => idx).sort()).toStrictEqual(
        [review3OfSecondUser.idx, review4OfSecondUser.idx].sort(),
      );
    });

    it('400 - invalid place idx', async () => {
      await testHelper
        .test()
        .get('/review/all')
        .query({
          placeIdx: 'invalid', // ! invalid place idx
          page: 1,
        })
        .expect(400);
    });

    it('400 - invalid user idx', async () => {
      await testHelper
        .test()
        .get('/review/all')
        .query({
          userIdx: 'invalid', // ! invalid place idx
          page: 1,
        })
        .expect(400);
    });

    it('403 - no placeIdx and no userIdx', async () => {
      await testHelper
        .test()
        .get('/review/all')
        .query({
          page: 1, // ! no placeIdx and no userIdx
        })
        .expect(403);
    });

    it('403 - userIdx is not login user', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const otherUser = testHelper.loginUsers.user2;

      await testHelper
        .test()
        .get('/review/all')
        .query({
          userIdx: otherUser.idx, // ! userIdx is not login user
          page: 1,
        })
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(403);
    });
  });

  describe('POST /place/:placeIdx/review', () => {
    it('201 - review field check', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
        roadAddress: {
          name: '서울시 강남구 테헤란로 123',
          detail: '테헤란로 123',
        },
      });

      const createReviewDto = {
        content: '기본 리뷰입니다.',
        imagePathList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
          '/review/f994f6ad-c42f-4c29-86db-d391fe450b1f-20250719.jpg',
        ],
        keywordIdxList: [1, 2],
      };

      const response = await testHelper
        .test()
        .post(`/place/${place.idx}/review`)
        .send(createReviewDto)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(201);

      const resultReview: ReviewEntity = response.body;

      const user = await testHelper.getPrisma().user.findUniqueOrThrow({
        where: { idx: loginUser.idx },
      });

      expect(resultReview.idx).toBeDefined();
      expect(resultReview.content).toBe(createReviewDto.content);
      expect(resultReview.imagePathList.sort()).toStrictEqual(
        (createReviewDto.imagePathList || [])?.sort(),
      );
      expect(
        resultReview.keywordList.map(({ idx }) => idx).sort(),
      ).toStrictEqual((createReviewDto.keywordIdxList || [])?.sort());
      expect(resultReview.place.idx).toBe(place.idx);
      expect(resultReview.place.name).toBe(place.name);
      expect(resultReview.place.roadAddress.name).toBe(place.roadAddress.name);
      expect(resultReview.place.roadAddress.detail).toBe(
        place.roadAddress.detail,
      );
      expect(resultReview.place.roadAddress.addressX).toBe(
        place.roadAddress.addressX,
      );
      expect(resultReview.place.roadAddress.addressY).toBe(
        place.roadAddress.addressY,
      );
      expect(resultReview.author.idx).toBe(loginUser.idx);
      expect(resultReview.author.nickname).toBe(user.nickname);
      expect(resultReview.author.profileImagePath).toBe(user.profileImagePath);
    });

    it('201 - check DB side effects', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createReviewDto = {
        content: '기본 리뷰입니다.',
        imagePathList: [],
        keywordIdxList: [1, 2],
      };

      // API 호출 전 초기 상태
      const placeBefore = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: place.idx },
      });

      const keywordCountBefore = await testHelper
        .getPrisma()
        .placeKeywordCount.findMany({
          where: {
            placeIdx: place.idx,
            keywordIdx: { in: createReviewDto.keywordIdxList },
          },
        });

      await testHelper
        .test()
        .post(`/place/${place.idx}/review`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(createReviewDto)
        .expect(201);

      // API 호출 후 상태
      const placeAfter = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: place.idx },
      });

      const keywordCountAfter = await testHelper
        .getPrisma()
        .placeKeywordCount.findMany({
          where: {
            placeIdx: place.idx,
            keywordIdx: { in: createReviewDto.keywordIdxList },
          },
        });

      const beforeMap = new Map(
        keywordCountBefore.map((kc) => [kc.keywordIdx, kc.count]),
      );

      const afterMap = new Map(
        keywordCountAfter.map((kc) => [kc.keywordIdx, kc.count]),
      );

      // 장소의 reviewCount가 1 증가했는지 확인
      expect(placeAfter.reviewCount).toBe(placeBefore.reviewCount + 1);

      // 각 keywordCount가 1씩 증가했는지 확인
      for (const keywordIdx of createReviewDto.keywordIdxList) {
        const beforeCount = beforeMap.get(keywordIdx) || 0;
        const afterCount = afterMap.get(keywordIdx);

        expect(afterCount).toBe(beforeCount + 1);
      }
    });

    it('201 - create with no optional data', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createReviewDto = {
        content: '기본 리뷰입니다.',
        imagePathList: [],
        keywordIdxList: [],
      };

      const response = await testHelper
        .test()
        .post(`/place/${place.idx}/review`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(createReviewDto)
        .expect(201);

      const resultReview: ReviewEntity = response.body;

      expect(resultReview.content).toBe(createReviewDto.content);
      expect(resultReview.imagePathList).toHaveLength(0);
      expect(resultReview.keywordList).toHaveLength(0);
    });

    it('201 - duplicate keywordIdxList', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createReviewDto = {
        content: '기본 리뷰입니다.',
        imagePathList: [],
        keywordIdxList: [1, 1],
      };

      const response = await testHelper
        .test()
        .post(`/place/${place.idx}/review`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(createReviewDto)
        .expect(201);

      const resultReview: ReviewEntity = response.body;

      const resultKeywordIdxList = resultReview.keywordList
        .map(({ idx }) => idx)
        .sort();

      // 중복이 제거된 값인지 확인
      expect(resultKeywordIdxList).toStrictEqual([1]);
    });

    it('400 - invalid place idx', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const createReviewDto = {
        content: '기본 리뷰입니다.',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .post(`/place/invalid/review`) // ! invalid placeIdx
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(createReviewDto)
        .expect(400);
    });

    it('400 - missing content', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createReviewDto = {
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .post(`/place/${place.idx}/review`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(createReviewDto)
        .expect(400);
    });

    it('400 - empty content', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createReviewDto = {
        content: '',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .post(`/place/${place.idx}/review`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(createReviewDto)
        .expect(400);
    });

    it('400 - content too short', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createReviewDto = {
        content: '짧음',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .post(`/place/${place.idx}/review`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(createReviewDto)
        .expect(400);
    });

    it('400 - content too long', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createReviewDto = {
        content: 'a'.repeat(401),
        imagePathList: [],
        keywordIdxList: [1, 1],
      };

      await testHelper
        .test()
        .post(`/place/${place.idx}/review`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(createReviewDto)
        .expect(400);
    });

    it('400 - too many keywordIdxList', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createReviewDto = {
        content: '기본 리뷰입니다.',
        imagePathList: [],
        keywordIdxList: [1, 2, 3, 4, 5, 6],
      };

      await testHelper
        .test()
        .post(`/place/${place.idx}/review`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(createReviewDto)
        .expect(400);
    });

    it('400 - too many imagePathList', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createReviewDto = {
        content: '기본 리뷰입니다.',
        imagePathList: [
          '/review/a1b2c3d4-e5f6-7890-1234-567890abcdef-20250721.jpg',
          '/review/b2c3d4e5-f6a7-8901-2345-67890abcdef1-20250721.jpg',
          '/review/c3d4e5f6-a7b8-9012-3456-7890abcdef12-20250721.jpg',
          '/review/d4e5f6a7-b8c9-0123-4567-890abcdef123-20250721.jpg',
          '/review/e5f6a7b8-c9d0-1234-5678-90abcdef1234-20250721.jpg',
          '/review/f6a7b8c9-d0e1-2345-6789-0abcdef12345-20250721.jpg',
        ],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .post(`/place/${place.idx}/review`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(createReviewDto)
        .expect(400);
    });

    it('401 - token is missing', async () => {
      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createReviewDto = {
        content: '기본 리뷰입니다.',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .post(`/place/${place.idx}/review`)
        .send(createReviewDto)
        .expect(401);
    });

    it('404 - place does not exist', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const createReviewDto = {
        content: '기본 리뷰입니다.',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .post(`/place/9999999/review`) // ! 존재하지 않는 placeIdx
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(createReviewDto)
        .expect(404);
    });

    it('500 - transaction failure', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      // 존재하지 않는 keywordIdx를 포함시켜 의도적으로 에러 유발
      const createReviewDto = {
        content: '기본 리뷰입니다.',
        imagePathList: [],
        keywordIdxList: [999999], // ! 존재하지 않는 keywordIdx
      };

      const placeBefore = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: place.idx },
      });

      await testHelper
        .test()
        .post(`/place/${place.idx}/review`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(createReviewDto)
        .expect(500);

      const placeAfter = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: place.idx },
      });

      // 모두 롤백되어 reviewCount가 이전 상태와 동일해야 함
      expect(placeAfter.reviewCount).toBe(placeBefore.reviewCount);
    });
  });

  describe('PUT /review/:reviewIdx', () => {
    it('200 - all fields modified', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const updateReviewDto = {
        content: '수정된 리뷰입니다.',
        imagePathList: [
          '/review/1111aaaa-2222-bbbb-3333-cccc4444dddd-20250721.jpg',
          '/review/eeee5555-ffff-6666-7777-gggg8888hhhh-20250721.jpg',
        ],
        keywordIdxList: [2, 3],
      };

      await testHelper
        .test()
        .put(`/review/${originalReview.idx}`)
        .send(updateReviewDto)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const updated = await testHelper.getPrisma().review.findUniqueOrThrow({
        where: { idx: originalReview.idx },
        include: {
          reviewImageList: true,
          reviewKeywordMappingList: { include: { keyword: true } },
        },
      });

      expect(updated.content).toBe(updateReviewDto.content);
      expect(updated.reviewImageList.map((i) => i.path).sort()).toStrictEqual(
        [...updateReviewDto.imagePathList].sort(),
      );
      expect(
        updated.reviewKeywordMappingList.map((k) => k.keyword.idx).sort(),
      ).toStrictEqual([...updateReviewDto.keywordIdxList].sort());
    });

    it('200 - all fields deleted (keep content)', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const updateReviewDto = {
        content: '수정된 리뷰입니다.', // ! content는 삭제 불가
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .put(`/review/${originalReview.idx}`)
        .send(updateReviewDto)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const updated = await testHelper.getPrisma().review.findUniqueOrThrow({
        where: { idx: originalReview.idx },
        include: {
          reviewImageList: true,
          reviewKeywordMappingList: true,
        },
      });
      expect(updated.content).toBe(updateReviewDto.content);
      expect(updated.reviewImageList.length).toBe(0);
      expect(updated.reviewKeywordMappingList.length).toBe(0);
    });

    it('200 - all fields kept', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const updateReviewDto = {
        content: originalReview.content,
        imagePathList: originalReview.reviewImgList || [],
        keywordIdxList: originalReview.keywordIdxList,
      };

      await testHelper
        .test()
        .put(`/review/${originalReview.idx}`)
        .send(updateReviewDto)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const updated = await testHelper.getPrisma().review.findUniqueOrThrow({
        where: { idx: originalReview.idx },
        include: {
          reviewImageList: true,
          reviewKeywordMappingList: { include: { keyword: true } },
        },
      });

      expect(updated.content).toBe(originalReview.content);
      expect(updated.reviewImageList.map((i) => i.path).sort()).toStrictEqual(
        [...(originalReview.reviewImgList || [])].sort(), // null일 경우 빈 배열로 안전하게 처리
      );
      expect(
        updated.reviewKeywordMappingList.map((k) => k.keyword.idx).sort(),
      ).toStrictEqual([...(originalReview.keywordIdxList || [])].sort());
    });

    it('200 - content only modified', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const updateReviewDto = {
        content: '수정된 리뷰입니다.',
        imagePathList: originalReview.reviewImgList,
        keywordIdxList: originalReview.keywordIdxList,
      };

      await testHelper
        .test()
        .put(`/review/${originalReview.idx}`)
        .send(updateReviewDto)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const updated = await testHelper.getPrisma().review.findUniqueOrThrow({
        where: { idx: originalReview.idx },
        include: {
          reviewImageList: true,
          reviewKeywordMappingList: { include: { keyword: true } },
        },
      });
      expect(updated.content).toBe(updateReviewDto.content);
      expect(updated.reviewImageList.map((i) => i.path).sort()).toStrictEqual(
        [...(originalReview.reviewImgList || [])].sort(),
      );
      expect(
        updated.reviewKeywordMappingList.map((k) => k.keyword.idx).sort(),
      ).toStrictEqual([...(originalReview.keywordIdxList || [])].sort());
    });

    it('200 - imagePathList only modified', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const updateReviewDto = {
        content: originalReview.content,
        keywordIdxList: originalReview.keywordIdxList,
        imagePathList: [
          '/review/1111aaaa-2222-bbbb-3333-cccc4444dddd-20250721.jpg',
          '/review/eeee5555-ffff-6666-7777-gggg8888hhhh-20250721.jpg',
        ],
      };

      await testHelper
        .test()
        .put(`/review/${originalReview.idx}`)
        .send(updateReviewDto)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const updated = await testHelper.getPrisma().review.findUniqueOrThrow({
        where: { idx: originalReview.idx },
        include: {
          reviewImageList: true,
          reviewKeywordMappingList: { include: { keyword: true } },
        },
      });
      expect(updated.content).toBe(originalReview.content);
      expect(updated.reviewImageList.map((i) => i.path).sort()).toStrictEqual(
        [...updateReviewDto.imagePathList].sort(),
      );
      expect(
        updated.reviewKeywordMappingList.map((k) => k.keyword.idx).sort(),
      ).toStrictEqual([...(originalReview.keywordIdxList || [])].sort());
    });

    it('200 - keywordIdxList only modified', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const updateReviewDto = {
        content: originalReview.content,
        imagePathList: originalReview.reviewImgList,
        keywordIdxList: [2, 3],
      };

      await testHelper
        .test()
        .put(`/review/${originalReview.idx}`)
        .send(updateReviewDto)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const updated = await testHelper.getPrisma().review.findUniqueOrThrow({
        where: { idx: originalReview.idx },
        include: {
          reviewImageList: true,
          reviewKeywordMappingList: { include: { keyword: true } },
        },
      });
      expect(updated.content).toBe(originalReview.content);
      expect(updated.reviewImageList.map((i) => i.path).sort()).toStrictEqual(
        [...(originalReview.reviewImgList || [])].sort(),
      );
      expect(
        updated.reviewKeywordMappingList.map((k) => k.keyword.idx).sort(),
      ).toStrictEqual([...updateReviewDto.keywordIdxList].sort());
    });

    it('200 - check DB side effects', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        keywordIdxList: [1],
      });

      const updateReviewDto = {
        content: originalReview.content,
        imagePathList: originalReview.reviewImgList,
        keywordIdxList: [2, 3, 4],
      };

      const allKeywordIdxList = [
        ...new Set([
          ...(originalReview.keywordIdxList || []),
          ...updateReviewDto.keywordIdxList,
        ]),
      ];

      const keywordCountBefore = await testHelper
        .getPrisma()
        .placeKeywordCount.findMany({
          where: {
            placeIdx: place.idx,
            keywordIdx: { in: allKeywordIdxList },
          },
        });
      const beforeMap = new Map(
        keywordCountBefore.map((kc) => [kc.keywordIdx, kc.count]),
      );

      await testHelper
        .test()
        .put(`/review/${originalReview.idx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(updateReviewDto)
        .expect(200);

      const keywordCountAfter = await testHelper
        .getPrisma()
        .placeKeywordCount.findMany({
          where: {
            placeIdx: place.idx,
            keywordIdx: {
              in: allKeywordIdxList,
            },
          },
        });

      const afterMap = new Map(
        keywordCountAfter.map((kc) => [kc.keywordIdx, kc.count]),
      );

      for (const removedKeyword of (originalReview.keywordIdxList || []).filter(
        (k) => !updateReviewDto.keywordIdxList.includes(k),
      )) {
        expect(afterMap.get(removedKeyword) ?? 0).toBe(
          (beforeMap.get(removedKeyword) ?? 0) - 1,
        );
      }

      for (const addedKeyword of updateReviewDto.keywordIdxList.filter(
        (k) => ![...(originalReview.keywordIdxList || [])].includes(k),
      )) {
        expect(afterMap.get(addedKeyword) ?? 0).toBe(
          (beforeMap.get(addedKeyword) ?? 0) + 1,
        );
      }
    });

    it('400 - invalid review idx', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const updateReviewDto = {
        content: '수정된 리뷰입니다.',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .put(`/review/invalid`) // ! invalid reviewIdx
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(updateReviewDto)
        .expect(400);
    });

    it('400 - empty content', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const updateReviewDto = {
        content: '',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .put(`/review/${originalReview.idx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(updateReviewDto)
        .expect(400);
    });

    it('400 - too short content', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const updateReviewDto = {
        content: '짧음',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .put(`/review/${originalReview.idx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(updateReviewDto)
        .expect(400);
    });

    it('400 - too long content', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const updateReviewDto = {
        content: 'a'.repeat(401),
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .put(`/review/${originalReview.idx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(updateReviewDto)
        .expect(400);
    });

    it('400 - too many keywordIdxList', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const updateReviewDto = {
        content: '수정된 리뷰입니다.',
        imagePathList: [],
        keywordIdxList: [1, 2, 3, 4, 5, 6],
      };

      await testHelper
        .test()
        .put(`/review/${originalReview.idx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(updateReviewDto)
        .expect(400);
    });

    it('400 - too many imagePathList', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const updateReviewDto = {
        content: '수정된 리뷰입니다.',
        imagePathList: [
          '/review/a1b2c3d4-e5f6-7890-1234-567890abcdef-20250721.jpg',
          '/review/b2c3d4e5-f6a7-8901-2345-67890abcdef1-20250721.jpg',
          '/review/c3d4e5f6-a7b8-9012-3456-7890abcdef12-20250721.jpg',
          '/review/d4e5f6a7-b8c9-0123-4567-890abcdef123-20250721.jpg',
          '/review/e5f6a7b8-c9d0-1234-5678-90abcdef1234-20250721.jpg',
          '/review/f6a7b8c9-d0e1-2345-6789-0abcdef12345-20250721.jpg',
        ],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .put(`/review/${originalReview}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(updateReviewDto)
        .expect(400);
    });

    it('401 - token is missing', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const updateReviewDto = {
        content: '수정된 리뷰입니다.',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .put(`/review/${originalReview.idx}`)
        .send(updateReviewDto)
        .expect(401);
    });

    it('403 - not the author of the review', async () => {
      const loginUser1 = testHelper.loginUsers.user1;
      const loginUser2 = testHelper.loginUsers.user2;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser1.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const updateReviewDto = {
        content: '수정된 리뷰입니다.',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .put(`/review/${originalReview.idx}`)
        .set('Authorization', `Bearer ${loginUser2.app.accessToken}`)
        .send(updateReviewDto)
        .expect(403);
    });

    it('404 - review does not exist', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const updateReviewDto = {
        content: '수정된 리뷰입니다.',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .put(`/review/999999`) // ! 존재하지 않는 reviewIdx
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(updateReviewDto)
        .expect(404);
    });

    it('500 - transaction failure', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      // 존재하지 않는 keywordIdx를 포함시켜 의도적으로 에러 유발
      const updateReviewDto = {
        content: originalReview.content,
        imagePathList: originalReview.reviewImgList,
        keywordIdxList: [999999], // ! 존재하지 않는 keywordIdx
      };

      const allKeywordIdxList = [
        ...new Set([
          ...(originalReview.keywordIdxList || []),
          ...(updateReviewDto.keywordIdxList || []),
        ]),
      ];

      const keywordCountBefore = await testHelper
        .getPrisma()
        .placeKeywordCount.findMany({
          where: {
            placeIdx: place.idx,
            keywordIdx: { in: allKeywordIdxList },
          },
        });

      const beforeMap = new Map(
        keywordCountBefore.map((kc) => [kc.keywordIdx, kc.count]),
      );

      await testHelper
        .test()
        .put(`/review/${originalReview.idx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(updateReviewDto)
        .expect(500);

      const keywordCountAfter = await testHelper
        .getPrisma()
        .placeKeywordCount.findMany({
          where: {
            placeIdx: place.idx,
            keywordIdx: { in: allKeywordIdxList },
          },
        });

      const afterMap = new Map(
        keywordCountAfter.map((kc) => [kc.keywordIdx, kc.count]),
      );

      // 모두 롤백되어 reviewCount가 이전 상태와 동일해야 함
      for (const keywordIdx of allKeywordIdxList) {
        const before = beforeMap.get(keywordIdx) ?? 0;
        const after = afterMap.get(keywordIdx) ?? 0;
        expect(after).toBe(before);
      }
    });
  });

  describe('DELETE /review/:reviewIdx', () => {
    it('200 - delete check', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      await testHelper
        .test()
        .delete(`/review/${originalReview.idx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const review = await testHelper.getPrisma().review.findUnique({
        where: { idx: originalReview.idx },
      });

      expect(review?.deletedAt).not.toBeNull();
    });

    it('200 - check DB side effects', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const placeBefore = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: place.idx },
      });

      const keywordIdxList = originalReview.keywordIdxList || [];

      const keywordCountBefore = await testHelper
        .getPrisma()
        .placeKeywordCount.findMany({
          where: {
            placeIdx: place.idx,
            keywordIdx: { in: keywordIdxList },
          },
        });

      const beforeMap = new Map(
        keywordCountBefore.map((kc) => [kc.keywordIdx, kc.count]),
      );

      await testHelper
        .test()
        .delete(`/review/${originalReview.idx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const placeAfter = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: place.idx },
      });

      expect(placeAfter.reviewCount).toBe(placeBefore.reviewCount - 1);

      const keywordCountAfter = await testHelper
        .getPrisma()
        .placeKeywordCount.findMany({
          where: {
            placeIdx: place.idx,
            keywordIdx: { in: keywordIdxList },
          },
        });

      const afterMap = new Map(
        keywordCountAfter.map((kc) => [kc.keywordIdx, kc.count]),
      );

      for (const keywordIdx of keywordIdxList) {
        const before = beforeMap.get(keywordIdx) ?? 0;
        const after = afterMap.get(keywordIdx) ?? 0;
        expect(after).toBe(before - 1);
      }
    });

    it('401 - token is missing', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      await testHelper
        .test()
        .delete(`/review/${originalReview.idx}`)
        .expect(401);
    });

    it('403 - not the author of the review', async () => {
      const loginUser1 = testHelper.loginUsers.user1;
      const loginUser2 = testHelper.loginUsers.user2;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser1.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      await testHelper
        .test()
        .delete(`/review/${originalReview.idx}`)
        .set('Authorization', `Bearer ${loginUser2.app.accessToken}`)
        .expect(403);
    });

    it('404 - review does not exist', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .delete('/review/9999999') // ! 존재하지 않는 reviewIdx
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(404);
    });

    it('500 - transaction failure', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const keywordIdxList = originalReview.keywordIdxList || [];

      const placeBefore = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: place.idx },
      });

      const keywordCountBefore = await testHelper
        .getPrisma()
        .placeKeywordCount.findMany({
          where: {
            placeIdx: place.idx,
            keywordIdx: { in: keywordIdxList },
          },
        });

      const beforeMap = new Map(
        keywordCountBefore.map((kc) => [kc.keywordIdx, kc.count]),
      );

      // 원본 함수 백업
      // 테스트 후를 위해 prisma의 실제 update 함수를 백업
      const originalUpdateFn = testHelper.getPrisma().review.update;

      try {
        // 직접 만든 가짜 모의 함수를 실제 update 함수에 덮어씀
        testHelper.getPrisma().review.update = jest
          .fn()
          .mockImplementation(() => Promise.reject());

        // 가짜 함수가 실행되어 에러 발생
        await testHelper
          .test()
          .delete(`/review/${originalReview.idx}`)
          .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
          .expect(500);
      } finally {
        // 원래 함수로 복원
        testHelper.getPrisma().review.update = originalUpdateFn;
      }

      // 상태 유지 확인 (롤백 검증)
      const reviewAfter = await testHelper
        .getPrisma()
        .review.findUniqueOrThrow({
          where: { idx: originalReview.idx },
        });
      expect(reviewAfter.deletedAt).toBeNull();

      const placeAfter = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: place.idx },
      });
      expect(placeAfter.reviewCount).toBe(placeBefore.reviewCount);

      const keywordCountAfter = await testHelper
        .getPrisma()
        .placeKeywordCount.findMany({
          where: {
            placeIdx: place.idx,
            keywordIdx: { in: keywordIdxList },
          },
        });

      const afterMap = new Map(
        keywordCountAfter.map((kc) => [kc.keywordIdx, kc.count]),
      );

      for (const keywordIdx of keywordIdxList) {
        const before = beforeMap.get(keywordIdx) ?? 0;
        const after = afterMap.get(keywordIdx) ?? 0;
        expect(after).toBe(before);
      }
    });
  });
});
