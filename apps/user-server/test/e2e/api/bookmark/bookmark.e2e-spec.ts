import { BookmarkCoreService } from '@libs/core';
import { BookmarkSeedHelper, PlaceSeedHelper } from '@libs/testing';
import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('Bookmark E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const bookmarkSeedHelper = testHelper.seedHelper(BookmarkSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('POST /place/:placeIdx/bookmark', () => {
    it('201 - successfully create bookmark', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/bookmark`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(201);

      const resultBookmark = response.body;
      expect(resultBookmark.idx).not.toBeNull();
      expect(resultBookmark.placeIdx).toBe(placeSeed.idx);
    });

    it('400 - invalid placeIdx', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const invalidPlaceIdx = 'invalid-place-idx';

      await testHelper
        .test()
        .post(`/place/${invalidPlaceIdx}/bookmark`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(400);
    });

    it('404 - place not found', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const nonExistentPlaceIdx = 9999999;

      await testHelper
        .test()
        .post(`/place/${nonExistentPlaceIdx}/bookmark`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(404);
    });

    it('409 - bookmark already exists', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      await bookmarkSeedHelper.seed({
        userIdx: loginUser.idx,
        placeIdx: placeSeed.idx,
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/bookmark`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(409);
    });
  });

  describe('DELETE /place/:placeIdx/bookmark', () => {
    it('200 - successfully delete bookmark', async () => {
      // user1 생성
      const loginUser = testHelper.loginUsers.user1;

      // place seeding
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      // bookmark seeding
      await bookmarkSeedHelper.seed({
        userIdx: loginUser.idx,
        placeIdx: placeSeed.idx,
      });

      // 북마크 삭제 전 존재 확인
      const bookmarkCoreService = testHelper.get(BookmarkCoreService);
      const beforeDeleteBookmark = await bookmarkCoreService.getBookmarkByIdx({
        userIdx: loginUser.idx,
        placeIdx: placeSeed.idx,
      });
      expect(beforeDeleteBookmark).not.toBeNull();

      // testing
      await testHelper
        .test()
        .delete(`/place/${placeSeed.idx}/bookmark`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      // 북마크 삭제 후 존재하지 않음을 확인
      const afterDeleteBookmark = await bookmarkCoreService.getBookmarkByIdx({
        userIdx: loginUser.idx,
        placeIdx: placeSeed.idx,
      });
      expect(afterDeleteBookmark).toBeNull();
    });

    it('400 - invalid placeIdx', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const invalidPlaceIdx = 'invalid-place-idx';

      await testHelper
        .test()
        .delete(`/place/${invalidPlaceIdx}/bookmark`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(400);
    });

    it('404 - place not found', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const nonExistentPlaceIdx = 9999999;

      await testHelper
        .test()
        .delete(`/place/${nonExistentPlaceIdx}/bookmark`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(404);
    });
  });
});
