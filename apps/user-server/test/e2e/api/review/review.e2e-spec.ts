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

      const reviewToDelete = await reviewSeedHelper.seed({
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
          page: 1,
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

      expect(placeAfter.reviewCount).toBe(placeBefore.reviewCount + 1);
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

      console.log(resultReview);
      const resultKeywordIdxList = resultReview.keywordList
        .map(({ idx }) => idx)
        .sort();

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
        .post(`/place/invalid/review`)
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

    it('400 - missing keywordIdxList', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createReviewDto = {
        content: '기본 리뷰입니다.',
        imagePathList: [],
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

    it('400 - missing imagePathList', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createReviewDto = {
        content: '기본 리뷰입니다.',
        keywordIdxList: [],
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
        .post(`/place/9999999/review`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send(createReviewDto)
        .expect(404);
    });

    it('500 - transaction rollback', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createReviewDto = {
        content: '기본 리뷰입니다.',
        imagePathList: [],
        keywordIdxList: [999999],
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

      expect(placeAfter.reviewCount).toBe(placeBefore.reviewCount);
    });
  });
});
