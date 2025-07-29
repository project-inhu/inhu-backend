import { AdminServerModule } from '@admin/admin-server.module';
import { S3_FOLDER, S3Service } from '@libs/common';
import { IMAGE_EXTENSION } from '@libs/common/modules/s3/constants/image-extension.constants';
import { TestHelper } from '../../setup/test.helper';
import { CreatePlaceImagePresignedUrlsDto } from '@admin/api/s3-upload/dto/request/create-place-image-presigned-url.dto';

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
          Key: `banner/some-uuid-for.jpg`,
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
        .send({ extension: IMAGE_EXTENSION.JPG })
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

  describe('POST /s3-upload/menu-image/presigned-url', () => {
    it('201 - successfully retrieves presigned post data for menu image upload', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const mockS3Response = {
        url: 'https://your-bucket.s3.amazonaws.com/',
        fields: {
          Key: `menu/some-uuid-for.jpg`,
          Policy: 'base64-encoded-policy-string',
          'X-Amz-Signature': 'signature-string',
        },
      };

      const s3ServiceMock = jest
        .spyOn(testHelper.get(S3Service), 'getPresignedUrl')
        .mockResolvedValue(mockS3Response);

      const response = await testHelper
        .test()
        .post('/s3-upload/menu-image/presigned-url')
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
        .post('/s3-upload/menu-image/presigned-url')
        .send({ extension: IMAGE_EXTENSION.JPG })
        .expect(401);
    });

    it('400 - extension is not provided', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/s3-upload/menu-image/presigned-url')
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('400 - extension is not in IMAGE_EXTENSION type', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/s3-upload/menu-image/presigned-url')
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send({ extension: 'webp' })
        .expect(400);
    });
  });

  describe('POST /s3-upload/place-image/presigned-urls', () => {
    it('201 - should successfully retrieve multiple presigned post data', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const dto: CreatePlaceImagePresignedUrlsDto = {
        extensions: ['jpg', 'png', 'png'],
      };

      const mockS3Response = [
        { url: 'https://s3.com/1', fields: { Key: 'place/uuid1.jpg' } },
        { url: 'https://s3.com/2', fields: { Key: 'place/uuid2.png' } },
        { url: 'https://s3.com/3', fields: { Key: 'place/uuid3.png' } },
      ];

      const s3ServiceMock = jest
        .spyOn(testHelper.get(S3Service), 'getPresignedUrls')
        .mockResolvedValue(mockS3Response);

      const response = await testHelper
        .test()
        .post('/s3-upload/place-image/presigned-urls')
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(dto)
        .expect(201);

      const responseBody = response.body;

      expect(responseBody).toHaveLength(3);

      expect(responseBody[0]).toHaveProperty('url');
      expect(responseBody[0]).toHaveProperty('fields');
      expect(responseBody[0].url).toEqual(mockS3Response[0].url);

      expect(s3ServiceMock).toHaveBeenCalledWith({
        folder: S3_FOLDER.PLACE,
        extensions: dto.extensions,
      });

      s3ServiceMock.mockRestore();
    });
  });

  it('401 - no accessToken', async () => {
    await testHelper
      .test()
      .post('/s3-upload/place-image/presigned-url')
      .send({ extension: IMAGE_EXTENSION.JPG })
      .expect(401);
  });
});
