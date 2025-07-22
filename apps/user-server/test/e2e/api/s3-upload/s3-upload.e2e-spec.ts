import { S3_FOLDER } from '@libs/common';
import { PresignedUrlEntity } from '@user/api/s3-upload/entity/pregiend-url.entity';
import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('s3-upload E2E test', () => {
  const testHelper = TestHelper.create(AppModule);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /s3-upload/profile-image/presigned-url', () => {
    it('200 - successfully retrieves presigned URL for profile image upload', async () => {
      const filename = 'test-image.jpg';
      const response = await testHelper
        .test()
        .get('/s3-upload/profile-image/presigned-url')
        .query({ filename })
        .set(
          'Authorization',
          `Bearer ${testHelper.loginUsers.user1.app.accessToken}`,
        )
        .expect(200);

      const responseBody: PresignedUrlEntity = response.body;

      expect(responseBody).toBeDefined();
      expect(responseBody).toHaveProperty('presignedUrl');
      expect(responseBody).toHaveProperty('key');
    });

    it('401 - no accessToken', async () => {
      await testHelper.test().get('/user').expect(401);
    });

    it('400 - folder and filename are not provided', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .get('/s3-upload/profile-image/presigned-url')
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(400);
    });

    it('400 - filename is not provided', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .get('/s3-upload/profile-image/presigned-url')
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .query({ folder: S3_FOLDER.PROFILE })
        .expect(400);
    });

    it('400 - folder is not provided', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .get('/s3-upload/profile-image/presigned-url')
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .query({ filename: 'test-image.jpg' })
        .expect(400);
    });

    it('400 - folder is not a valid S3Folder type', async () => {
      const loginUser = testHelper.loginUsers.user1;
      await testHelper
        .test()
        .get('/s3-upload/profile-image/presigned-url')
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .query({ folder: 'invalid-folder', filename: 'test-image.jpg' })
        .expect(400);
    });
  });
});
