import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('Auth E2E test', () => {
  const testHelper = TestHelper.create(AppModule);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('POST /auth/refresh-token/regenerate/web', () => {
    it('200 - successfully reissues access token', async () => {
      const { user1 } = testHelper.loginUsers;

      const response = await testHelper
        .test()
        .post('/auth/refresh-token/regenerate/web')
        .set('Cookie', [`refreshToken=Bearer ${user1.app.refreshToken}`])
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.accessToken).toBeDefined();
    });

    it('401 - no refresh token', async () => {
      await testHelper
        .test()
        .post('/auth/refresh-token/regenerate/web')
        .expect(401);
    });
  });
});
