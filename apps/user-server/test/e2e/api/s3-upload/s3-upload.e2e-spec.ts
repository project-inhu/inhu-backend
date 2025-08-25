import { ContentType } from '@libs/common/modules/s3/constants/content-type.constants';
import { ImageExtension } from '@libs/common/modules/s3/constants/image-extension.constants';
import { S3Folder } from '@libs/common/modules/s3/constants/s3-folder.constants';
import { S3Service } from '@libs/common/modules/s3/s3.service';
import { CreateReviewImagePresignedUrlsDto } from '@user/api/s3-upload/dto/request/create-review-image-presigned-url.dto';
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
        fileHost: 'https://your-bucket.s3.amazonaws.com',
        filePath: '/profile/some-uuid-for.jpg',
      };

      const s3ServiceMock = jest
        .spyOn(testHelper.get(S3Service), 'getPresignedUrl')
        .mockResolvedValue(mockS3Response);

      const response = await testHelper
        .test()
        .post('/s3-upload/profile-image/presigned-url')
        .send({
          extension: ImageExtension.JPG,
          maxSize: 1,
          contentType: ContentType.IMAGE,
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

    it('400 - extension is not in ImageExtension type', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/s3-upload/profile-image/presigned-url')
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .send({ extension: 'txt' })
        .expect(400);
    });
  });

  describe('POST /s3-upload/review-image/presigned-urls', () => {
    it('201 - should successfully retrieve multiple presigned post data', async () => {
      const loginUser = testHelper.loginUsers.user1;

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
        .set('Cookie', `token=Bearer ${loginUser.app.accessToken}`)
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
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/s3-upload/review-image/presigned-urls')
        .set('Cookie', `token=Bearer ${loginUser.app.accessToken}`)
        .send({})
        .expect(400);
    });

    it('400 - extensions array is empty', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/s3-upload/review-image/presigned-urls')
        .set('Cookie', `token=Bearer ${loginUser.app.accessToken}`)
        .send({ extensions: [] })
        .expect(400);
    });

    it('400 - extensions array contains an invalid extension', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/s3-upload/review-image/presigned-urls')
        .set('Cookie', `token=Bearer ${loginUser.app.accessToken}`)
        .send({ extensions: ['abc', 'gif'] })
        .expect(400);
    });

    it('400 - extensions array exceeds max size', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const tooManyExtensions = new Array(10).fill(ImageExtension.JPG);

      await testHelper
        .test()
        .post('/s3-upload/review-image/presigned-urls')
        .set('Cookie', `token=Bearer ${loginUser.app.accessToken}`)
        .send({ extensions: tooManyExtensions })
        .expect(400);
    });
  });
});
