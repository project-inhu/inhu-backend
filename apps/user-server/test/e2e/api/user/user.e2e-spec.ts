import { UserCoreService } from '@libs/core';
import { UserEntity } from '@user/api/user/entity/user.entity';
import { UserService } from '@user/api/user/user.service';
import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('User E2E test', () => {
  const testHelper = TestHelper.create(AppModule);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /user', () => {
    it('200 - successfully retrieves user info', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const response = await testHelper
        .test()
        .get('/user')
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const responseBody: UserEntity = response.body;

      expect(responseBody).toBeDefined();
      expect(responseBody).toHaveProperty('idx');
      expect(responseBody).toHaveProperty('nickname');
      expect(responseBody).toHaveProperty('profileImagePath');
      expect(responseBody).toHaveProperty('createdAt');
      expect(responseBody).toHaveProperty('provider');

      expect(responseBody.idx).toEqual(loginUser.idx);

      const user = await testHelper.getPrisma().user.findUniqueOrThrow({
        where: { idx: loginUser.idx },
        select: {
          nickname: true,
          profileImagePath: true,
          userProvider: { select: { name: true } },
          createdAt: true,
        },
      });
      expect(responseBody.nickname).toEqual(user.nickname);
      expect(responseBody.profileImagePath).toEqual(user.profileImagePath);
      expect(responseBody.provider).toEqual(user.userProvider?.name);
      expect(new Date(responseBody.createdAt)).toEqual(user.createdAt);
    });

    it('401 - no accessToken', async () => {
      await testHelper.test().get('/user').expect(401);
    });

    it('500 - Authenticated user not found in DB', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const spy = jest
        .spyOn(testHelper.get(UserCoreService), 'getUserByIdx')
        .mockResolvedValueOnce(null);

      await testHelper
        .test()
        .get('/user')
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(500);

      spy.mockRestore();
    });
  });
});
