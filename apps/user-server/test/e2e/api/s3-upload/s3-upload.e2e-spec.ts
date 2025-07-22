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
      const requestFilename = 'test-image.jpg';
      const mockPresignedUrl = 'https://example.com/presigned-url';
      const mockKey = `/${S3_FOLDER.PROFILE}/${requestFilename}`;

      const spy = jest
        .spyOn(testHelper.get(S3Service), 'getPresignedUrl')
        .mockResolvedValueOnce({
          presignedUrl: mockPresignedUrl,
          key: mockKey,
        } as PresignedUrlEntity);

      const response = await testHelper
        .test()
        .post('/s3-upload/profile-image/presigned-url')
        .send({ folder: S3_FOLDER.PROFILE, filename: requestFilename })
        .set(
          'Authorization',
          `Bearer ${testHelper.loginUsers.user1.app.accessToken}`,
        )
        .expect(201);

      const responseBody: PresignedUrlEntity = response.body;

      expect(responseBody).toBeDefined();
      expect(responseBody).toHaveProperty('presignedUrl');
      expect(responseBody).toHaveProperty('key');

      expect(responseBody.presignedUrl).toEqual(mockPresignedUrl);
      expect(responseBody.key).toEqual(mockKey);

      spy.mockRestore();
    });
  });
});
