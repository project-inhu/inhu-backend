import { AdminServerModule } from '@admin/admin-server.module';
import { ImageExtension } from '@libs/common/modules/s3/constants/image-extension.constants';
import { TestHelper } from '../../setup/test.helper';
import { CreatePlaceImagePresignedUrlsDto } from '@admin/api/s3-upload/dto/request/create-place-image-presigned-url.dto';
import { CreateReviewImagePresignedUrlsDto } from '@admin/api/s3-upload/dto/request/create-review-image-presigned-url.dto';
import { S3Service } from '@libs/common/modules/s3/s3.service';
import { S3Folder } from '@libs/common/modules/s3/constants/s3-folder.constants';
import { ContentType } from '@libs/common/modules/s3/constants/content-type.constants';

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
        fileHost: 'https://your-bucket.s3.amazonaws.com/',
        filePath: `banner/some-uuid-for.jpg`,
      };

      const s3ServiceMock = jest
        .spyOn(testHelper.get(S3Service), 'getPresignedUrl')
        .mockResolvedValue(mockS3Response);

      const response = await testHelper
        .test()
        .post('/s3-upload/banner-image/presigned-url')
        .send({
          extension: ImageExtension.JPG,
          maxSize: 10,
          contentType: ContentType.IMAGE,
        })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .send({ extension: ImageExtension.JPG })
        .expect(401);
    });

    it('400 - extension field is not provided', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/s3-upload/banner-image/presigned-url')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('400 - extension is not in ImageExtension type', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/s3-upload/banner-image/presigned-url')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ extension: 'unknown_extension' })
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
        fileHost: 'https://your-bucket.s3.amazonaws.com/',
        filePath: `banner/some-uuid-for.jpg`,
      };

      const s3ServiceMock = jest
        .spyOn(testHelper.get(S3Service), 'getPresignedUrl')
        .mockResolvedValue(mockS3Response);

      const response = await testHelper
        .test()
        .post('/s3-upload/menu-image/presigned-url')
        .send({
          extension: ImageExtension.JPG,
          maxSize: 10,
          contentType: ContentType.IMAGE,
        })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .send({ extension: ImageExtension.JPG })
        .expect(401);
    });

    it('400 - extension field is not provided', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/s3-upload/menu-image/presigned-url')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('400 - extension is not in ImageExtension type', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/s3-upload/menu-image/presigned-url')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ extension: 'unknown_extension' })
        .expect(400);
    });
  });

  describe('POST /s3-upload/place-image/presigned-urls', () => {
    it('201 - should successfully retrieve multiple presigned post data', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const dto: CreatePlaceImagePresignedUrlsDto = {
        extensions: [
          ImageExtension.JPG,
          ImageExtension.PNG,
          ImageExtension.PNG,
        ],
      };

      const mockS3Response = [
        {
          url: 'https://s3.com/1',
          fields: { Key: 'place/uuid1.jpg' },
          fileHost: 'https://your-bucket.s3.amazonaws.com/',
          filePath: `banner/some-uuid-for.jpg`,
        },
        {
          url: 'https://s3.com/2',
          fields: { Key: 'place/uuid2.png' },
          fileHost: 'https://your-bucket.s3.amazonaws.com/',
          filePath: `banner/some-uuid-for.jpg`,
        },
        {
          url: 'https://s3.com/3',
          fields: { Key: 'place/uuid3.png' },
          fileHost: 'https://your-bucket.s3.amazonaws.com/',
          filePath: `banner/some-uuid-for.jpg`,
        },
      ];

      const s3ServiceMock = jest
        .spyOn(testHelper.get(S3Service), 'getPresignedUrls')
        .mockResolvedValue(mockS3Response);

      const response = await testHelper
        .test()
        .post('/s3-upload/place-image/presigned-urls')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(201);

      const responseBody = response.body;

      expect(responseBody).toHaveLength(3);

      expect(responseBody[0]).toHaveProperty('url');
      expect(responseBody[0]).toHaveProperty('fields');
      expect(responseBody[0].url).toEqual(mockS3Response[0].url);

      expect(s3ServiceMock).toHaveBeenCalledWith({
        folder: S3Folder.PLACE,
        extensions: dto.extensions,
        maxSize: 10,
        contentType: 'image/',
      });

      s3ServiceMock.mockRestore();
    });

    it('401 - no accessToken', async () => {
      await testHelper
        .test()
        .post('/s3-upload/place-image/presigned-urls')
        .send({ extension: ImageExtension.JPG })
        .expect(401);
    });

    it('400 - extensions field is not provided', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/s3-upload/place-image/presigned-urls')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({})
        .expect(400);
    });

    it('400 - extensions array is empty', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/s3-upload/place-image/presigned-urls')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ extensions: [] })
        .expect(400);
    });

    it('400 - extensions array contains an invalid extension', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/s3-upload/place-image/presigned-urls')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ extensions: ['jpg', 'gif'] })
        .expect(400);
    });

    it('400 - extensions array exceeds max size', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const tooManyExtensions = new Array(10).fill(ImageExtension.JPG);

      await testHelper
        .test()
        .post('/s3-upload/place-image/presigned-urls')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ extensions: tooManyExtensions })
        .expect(400);
    });
  });

  describe('POST /s3-upload/review-image/presigned-urls', () => {
    it('201 - should successfully retrieve multiple presigned post data', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const dto: CreateReviewImagePresignedUrlsDto = {
        extensions: [
          ImageExtension.JPG,
          ImageExtension.PNG,
          ImageExtension.JPEG,
        ],
      };

      const mockS3Response = [
        {
          url: 'https://s3.com/1',
          fields: { Key: 'review/uuid1.png' },
          fileHost: 'https://your-bucket.s3.amazonaws.com/',
          filePath: `banner/some-uuid-for.jpg`,
        },
        {
          url: 'https://s3.com/2',
          fields: { Key: 'review/uuid2.jpg' },
          fileHost: 'https://your-bucket.s3.amazonaws.com/',
          filePath: `banner/some-uuid-for.jpg`,
        },
        {
          url: 'https://s3.com/3',
          fields: { Key: 'review/uuid3.jpeg' },
          fileHost: 'https://your-bucket.s3.amazonaws.com/',
          filePath: `banner/some-uuid-for.jpg`,
        },
      ];

      const s3ServiceMock = jest
        .spyOn(testHelper.get(S3Service), 'getPresignedUrls')
        .mockResolvedValue(mockS3Response);

      const response = await testHelper
        .test()
        .post('/s3-upload/review-image/presigned-urls')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(201);

      const responseBody = response.body;

      expect(responseBody).toHaveLength(3);

      expect(responseBody[0]).toHaveProperty('url');
      expect(responseBody[0]).toHaveProperty('fields');
      expect(responseBody[0].url).toEqual(mockS3Response[0].url);

      expect(s3ServiceMock).toHaveBeenCalledWith({
        folder: S3Folder.REVIEW,
        extensions: dto.extensions,
        maxSize: 1,
        contentType: ContentType.IMAGE,
      });

      s3ServiceMock.mockRestore();
    });

    it('401 - no accessToken', async () => {
      await testHelper
        .test()
        .post('/s3-upload/review-image/presigned-urls')
        .send({ extension: ImageExtension.JPG })
        .expect(401);
    });

    it('400 - extensions field is not provided', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/s3-upload/review-image/presigned-urls')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({})
        .expect(400);
    });

    it('400 - extensions array is empty', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/s3-upload/review-image/presigned-urls')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ extensions: [] })
        .expect(400);
    });

    it('400 - extensions array contains an invalid extension', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/s3-upload/review-image/presigned-urls')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ extensions: ['abc', 'gif'] })
        .expect(400);
    });

    it('400 - extensions array exceeds max size', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const tooManyExtensions = new Array(10).fill(ImageExtension.JPG);

      await testHelper
        .test()
        .post('/s3-upload/review-image/presigned-urls')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ extensions: tooManyExtensions })
        .expect(400);
    });
  });
});
