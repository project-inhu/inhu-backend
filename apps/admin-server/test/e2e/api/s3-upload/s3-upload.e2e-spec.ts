import { AdminServerModule } from '@admin/admin-server.module';
import { S3Service } from '@libs/common';
import { IMAGE_EXTENSION } from '@libs/common/modules/s3/constants/image-extension.constants';
import { TestHelper } from '../../setup/test.helper';

describe('s3-upload E2E test', () => {
  const testHelper = TestHelper.create(AdminServerModule);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('POST /s3-upload/banner-image/presigned-url', () => {
    it('201 - successfully retrieves presigned post data for banner image upload', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const mockS3Response = {
        url: 'https://your-bucket.s3.amazonaws.com/',
        fields: {
          Key: `banner/some-uuid-for`,
          Policy: 'base64-encoded-policy-string',
          'X-Amz-Signature': 'signature-string',
        },
      };

      const s3ServiceMock = jest
        .spyOn(testHelper.get(S3Service), 'getPresignedUrl')
        .mockResolvedValue(mockS3Response);

      const response = await testHelper
        .test()
        .post('/s3-upload/banner-image/presigned-url')
        .send({ extension: IMAGE_EXTENSION.JPG })
        .set('Authorization', `Bearer ${loginUser.token}`)
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
        .post('/s3-upload/banner-image/presigned-url')
        .expect(401);
    });

    it('400 - extension is not provided', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/s3-upload/banner-image/presigned-url')
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('400 - extension is not in IMAGE_EXTENSION type', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/s3-upload/banner-image/presigned-url')
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send({ extension: 'gif' })
        .expect(400);
    });
  });
});
