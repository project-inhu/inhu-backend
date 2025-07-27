import { S3_FOLDER, S3Service } from '@libs/common';
import { PresignedUrlEntity } from '@user/api/s3-upload/entity/presigned-url.entity';
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

  describe('POST /s3-upload/profile-image/presigned-url', () => {
    it('201 - successfully retrieves presigned URL for profile image upload', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const mockPresignedUrl = 'https://example.com/presigned-url';
      const mockKey = `/${S3_FOLDER.PROFILE}/test-image.jpg`;

      const s3ServiceMock = jest
        .spyOn(testHelper.get(S3Service), 'getPresignedUrls')
        .mockResolvedValue([{ presignedUrl: mockPresignedUrl, key: mockKey }]);

      const response = await testHelper
        .test()
        .post('/s3-upload/profile-image/presigned-url')
        .send({ filename: 'test-image.jpg' })
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(201);

      const responseBody: PresignedUrlEntity = response.body[0];

      expect(responseBody).toBeDefined();
      expect(responseBody).toHaveProperty('presignedUrl');
      expect(responseBody).toHaveProperty('key');

      expect(responseBody.key).toContain('test-image.jpg');

      s3ServiceMock.mockRestore();
    });

    it('401 - no accessToken', async () => {
      await testHelper.test().get('/user').expect(401);
    });

    it('400 - folder and filename are not provided', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/s3-upload/profile-image/presigned-url')
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(400);
    });

    it('400 - filename is not provided', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/s3-upload/profile-image/presigned-url')
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send({ folder: S3_FOLDER.PROFILE })
        .expect(400);
    });
  });
});
