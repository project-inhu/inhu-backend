import {
  PlaceSeedHelper,
  ReviewSeedHelper,
  UserSeedHelper,
} from '@libs/testing';
import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('Review E2E test', () => {
  const testHelper = TestHelper.create(AppModule);

  let userIdx: number;
  let placeIdx: number;
  let reviewIdx: number;

  beforeEach(async () => {
    await testHelper.init();

    const user = await testHelper
      .seedHelper(UserSeedHelper)
      .seed({ deletedAt: null });
    userIdx = user.idx;

    const place = await testHelper
      .seedHelper(PlaceSeedHelper)
      .seed({ deletedAt: null });
    placeIdx = place.idx;

    const review = await testHelper
      .seedHelper(ReviewSeedHelper)
      .seed({ userIdx: user.idx, placeIdx: place.idx, deletedAt: null });
    reviewIdx = review.idx;
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /review/all', () => {
    it('should return empty array if no reviews exist for the place', async () => {
      console.log('placeIdx', placeIdx);
      const review = await testHelper.getPrisma().review.update({
        where: { idx: reviewIdx },
        data: { deletedAt: new Date() },
      });
      console.log('reviewIdx', review);
      const res = await testHelper
        .test()
        .get(`/review/all?placeIdx=${placeIdx}`)
        .expect(200);

      expect(res.body).toEqual([]);
    });

    it('should return 1 review if only one exists for the place', async () => {
      const res = await testHelper
        .test()
        .get(`/review/all?placeIdx=${placeIdx}`)
        .expect(200);

      console.log(res.body);
      expect(res.body[0]).toHaveLength(1);
      const review = res.body[0];

      expect(review).toHaveProperty('idx');
      expect(review.placeIdx).toBe(placeIdx);
      expect(review.userIdx).toBe(userIdx);
    });
  });
});
