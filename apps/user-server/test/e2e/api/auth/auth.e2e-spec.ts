import { AppModule } from '@user/app.module';
import { TokenCategory } from '@user/common/module/login-token/constants/token-category.constant';
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

    it('401 - invalid refresh token', async () => {
      const invalidRefresh = 'invalid refresh token';

      await testHelper
        .test()
        .post('/auth/refresh-token/regenerate/web')
        .set('Cookie', [`refreshToken=Bearer ${invalidRefresh}`])
        .expect(401);
    });
  });

  describe('POST /auth/refresh-token/regenerate/app', () => {
    it('200 - successfully reissues access token', async () => {
      const { user1 } = testHelper.loginUsers;
      const refreshToken = user1.app.refreshToken;

      const loginTokenService = testHelper.get(LoginTokenService);
      const refreshTokenPayload =
        await loginTokenService.verifyRefreshToken(refreshToken);

      const response = await testHelper
        .test()
        .post('/auth/refresh-token/regenerate/app')
        .send({ refreshTokenWithType: `Bearer ${refreshToken}` })
        .expect(200);

      const accessToken = response.body.accessToken;

      expect(accessToken).toBeDefined();

      const accessTokenPayload =
        await loginTokenService.verifyAccessToken(accessToken);

      expect(accessTokenPayload.category).toBe(TokenCategory.ACCESS);
      expect(accessTokenPayload.issuedBy).toBe(TokenIssuedBy.APP);
      expect(accessTokenPayload.idx).toBe(refreshTokenPayload.idx);
      expect(accessTokenPayload.id).toBe(refreshTokenPayload.jti);
    });

    it('400 - no refresh token provided', async () => {
      await testHelper
        .test()
        .post('/auth/refresh-token/regenerate/app')
        .expect(400);
    });

    it('401 - invalid refresh token', async () => {
      const invalidRefreshToken = 'invalid refresh token';

      await testHelper
        .test()
        .post('/auth/refresh-token/regenerate/app')
        .send({ refreshTokenWithType: `Bearer ${invalidRefreshToken}` })
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
        .post('/auth/refresh-token/regenerate/app')
        .send({ refreshTokenWithType: `Bearer ${refreshToken}` })
        .expect(401);
    });
  });
});
