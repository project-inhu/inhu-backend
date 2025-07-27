import { TestHelper } from '../../setup/test.helper';
import {
  PlaceSeedHelper,
  ReviewSeedHelper,
  UserSeedHelper,
} from '@libs/testing';
import { AdminServerModule } from '@admin/admin-server.module';

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
});
