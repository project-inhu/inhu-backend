import { AppModule } from '@user/app.module';
import { TokenIssuedBy } from '@user/common/module/login-token/constants/token-issued-by.constants';
import { LoginTokenService } from '@user/common/module/login-token/login-token.service';
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

    it('401 - using invalidated refresh token', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const refreshToken = loginUser.app.refreshToken;

      // invalidate the refresh token
      const loginTokenService = testHelper.get(LoginTokenService);
      const refreshTokenPayload =
        await loginTokenService.verifyRefreshToken(refreshToken);
      await loginTokenService.invalidateRefreshTokenById(
        refreshTokenPayload.idx,
        refreshTokenPayload.jti,
        TokenIssuedBy.APP,
      );

      await testHelper
        .test()
        .post('/auth/refresh-token/regenerate/web')
        .set('Cookie', [`refreshToken=Bearer ${refreshToken}`])
        .expect(401);
    });
  });
});
