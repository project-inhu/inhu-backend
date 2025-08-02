import { IMAGE_EXTENSION } from '@libs/common/modules/s3/constants/image-extension.constants';
import { S3Service } from '@libs/common/modules/s3/s3.service';
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
    it('201 - successfully retrieves presigned post data for profile image upload', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const mockS3Response = {
        url: 'https://your-bucket.s3.amazonaws.com/',
        fields: {
          Key: `profile/some-uuid-for.jpg`,
          Policy: 'base64-encoded-policy-string',
          'X-Amz-Signature': 'signature-string',
        },
      };

      const s3ServiceMock = jest
        .spyOn(testHelper.get(S3Service), 'getPresignedUrl')
        .mockResolvedValue(mockS3Response);

      const response = await testHelper
        .test()
        .post('/s3-upload/profile-image/presigned-url')
        .send({
          extension: IMAGE_EXTENSION.JPG,
          maxSize: 10,
          contentType: 'image/',
        })
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(201);

      const responseBody = response.body;

      expect(responseBody).toBeDefined();
      expect(responseBody).toHaveProperty('url');
      expect(responseBody).toHaveProperty('fields');

      expect(responseBody.url).toEqual(mockS3Response.url);
      expect(responseBody.fields.Key).toEqual(mockS3Response.fields.Key);

      s3ServiceMock.mockRestore();
    });

    it('401 - no accessToken', async () => {
      await testHelper
        .test()
        .post('/s3-upload/profile-image/presigned-url')
        .expect(401);
    });

    it('400 - extension is not provided', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/s3-upload/profile-image/presigned-url')
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(400);
    });

    it('400 - extension is not in IMAGE_EXTENSION type', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/s3-upload/profile-image/presigned-url')
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send({ extension: 'txt' })
        .expect(400);
    });

    it('400 - maxSize is not provided', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/s3-upload/profile-image/presigned-url')
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send({ extension: IMAGE_EXTENSION.JPG, contentType: 'image/' })
        .expect(400);
    });

    it('400 - maxSize is not a number', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/s3-upload/profile-image/presigned-url')
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send({
          extension: IMAGE_EXTENSION.JPG,
          maxSizeInMB: 'ten',
          contentType: 'image/',
        })
        .expect(400);
    });

    it('400 - contentType is not provided', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/s3-upload/profile-image/presigned-url')
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send({
          extension: IMAGE_EXTENSION.JPG,
          maxSizeInMB: 10,
        })
        .expect(400);
    });
  });
});
