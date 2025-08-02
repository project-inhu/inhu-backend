import { TestHelper } from '../../setup/test.helper';
import { AdminServerModule } from '@admin/admin-server.module';
import { GetAllReviewResponseDto } from '@admin/api/review/dto/response/get-all-review.reponse.dto';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { ReviewSeedHelper } from '@libs/testing/seed/review/review.seed';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';

describe('Admin Review E2E Tests', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const reviewSeedHelper = testHelper.seedHelper(ReviewSeedHelper);
  const userSeedHelper = testHelper.seedHelper(UserSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('DELETE /review/:reviewIdx', () => {
    it('200 - delete check', async () => {
      const adminUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      await testHelper
        .test()
        .delete(`/review/${originalReview.idx}`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .expect(200);

      const review = await testHelper.getPrisma().review.findUnique({
        where: { idx: originalReview.idx },
      });

      expect(review?.deletedAt).not.toBeNull();
    });

    it('200 - check DB side effects', async () => {
      const adminUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
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
        .set('Authorization', `Bearer ${adminUser.token}`)
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
      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
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

    it('404 - review does not exist', async () => {
      const adminUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete('/review/9999999') // ! 존재하지 않는 reviewIdx
        .set('Authorization', `Bearer ${adminUser.token}`)
        .expect(404);
    });

    it('500 - transaction failure', async () => {
      const adminUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
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
          .set('Authorization', `Bearer ${adminUser.token}`)
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

  describe('GET /review/all', () => {
    it('200 - review field check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

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
        userIdx: user.idx,
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
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);

      const body: GetAllReviewResponseDto = response.body;

      const { reviewList } = body;

      const resultReview = reviewList[0];

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
      expect(resultReview.author.idx).toBe(user.idx);
      expect(resultReview.author.nickname).toBe(user.nickname);
      expect(resultReview.author.profileImagePath).toBe(user.profileImagePath);
    });

    it('200 - hasNext check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      // placeIdx가 place.idx인 리뷰 10개 생성
      await reviewSeedHelper.seedAll(
        Array.from({ length: 10 }, () => ({
          placeIdx: place.idx,
          userIdx: user.idx,
        })),
      );

      const response = await testHelper
        .test()
        .get('/review/all')
        .query({
          placeIdx: place.idx,
          page: 1,
        })
        .set('Authorization', `Bearer ${loginUser.token}`)
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
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);

      expect(response2.body.hasNext).toBe(true);
    });

    it('200 - sort order asc check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const firstReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
      });

      // 시간 간격을 두어 생성 순서를 명확히 함
      await new Promise((resolve) => setTimeout(resolve, 20));

      const secondReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
      });

      const response = await testHelper
        .test()
        .get('/review/all')
        .query({ placeIdx: place.idx, page: 1, orderBy: 'time', order: 'asc' })
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);

      const { reviewList }: GetAllReviewResponseDto = response.body;

      expect(reviewList[0].idx).toBe(firstReview.idx);
      expect(reviewList[1].idx).toBe(secondReview.idx);
    });

    it('200 - sort order desc check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const firstReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
      });

      // 시간 간격을 두어 생성 순서를 명확히 함
      await new Promise((resolve) => setTimeout(resolve, 20));

      const secondReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
      });

      const response = await testHelper
        .test()
        .get('/review/all')
        .query({ placeIdx: place.idx, page: 1, orderBy: 'time', order: 'desc' })
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);

      const { reviewList }: GetAllReviewResponseDto = response.body;

      expect(reviewList[0].idx).toBe(secondReview.idx);
      expect(reviewList[1].idx).toBe(firstReview.idx);
    });

    it('200 - soft delete check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      // 삭제된 리뷰 생성
      await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
        deletedAt: new Date(),
      });

      const reviewToKeep = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
      });

      const response = await testHelper
        .test()
        .get('/review/all')
        .query({ placeIdx: place.idx, page: 1 })
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);

      const { reviewList }: GetAllReviewResponseDto = response.body;

      expect(reviewList[0].idx).toBe(reviewToKeep.idx);
    });

    it('200 - place idx filtering check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

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
        { placeIdx: firstPlace.idx, userIdx: user.idx },
        { placeIdx: firstPlace.idx, userIdx: user.idx },
        { placeIdx: secondPlace.idx, userIdx: user.idx },
        { placeIdx: secondPlace.idx, userIdx: user.idx },
      ]);

      const firstPlaceResponse = await testHelper
        .test()
        .get('/review/all')
        .query({
          placeIdx: firstPlace.idx,
          page: 1,
        })
        .set('Authorization', `Bearer ${loginUser.token}`)
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
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);

      const reviewsOfSecondPlace = (
        secondPlaceResponse.body as GetAllReviewResponseDto
      ).reviewList;

      expect(reviewsOfSecondPlace.map(({ idx }) => idx).sort()).toStrictEqual(
        [review3OfSecondPlace.idx, review4OfSecondPlace.idx].sort(),
      );
    });

    it('200 - user idx filtering check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const firstUser = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const secondUser = await userSeedHelper.seed({
        nickname: 'testUser2',
        profileImagePath: '/profile/testUser2.png',
      });

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
        .set('Authorization', `Bearer ${loginUser.token}`)
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
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);

      const reviewsOfSecondUser = (
        secondUserResponse.body as GetAllReviewResponseDto
      ).reviewList;

      expect(reviewsOfSecondUser.map(({ idx }) => idx).sort()).toStrictEqual(
        [review3OfSecondUser.idx, review4OfSecondUser.idx].sort(),
      );
    });

    it('400 - invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/review/all')
        .query({
          placeIdx: 'invalid', // ! invalid place idx
          page: 1,
        })
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('400 - invalid user idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/review/all')
        .query({
          userIdx: 'invalid', // ! invalid place idx
          page: 1,
        })
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('403 - no placeIdx and no userIdx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/review/all')
        .query({
          page: 1, // ! no placeIdx and no userIdx
        })
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(403);
    });
  });
});
