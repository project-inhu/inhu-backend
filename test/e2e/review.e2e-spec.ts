import { INestApplication } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import * as request from 'supertest';
import { TestManager } from 'test/common/helpers/test-manager';

describe('ReviewController', () => {
  let app: INestApplication;
  let test = TestManager.create();
  let userIdx: number;
  let placeIdx: number;
  let reviewIdx: number;
  let keywordIdxList: number[];
  let imagePathList: string[];

  beforeAll(async () => {
    await test.init();
    app = test.getApp();

    const prisma = app.get(PrismaService);

    const user = await prisma.user.create({
      data: { nickname: 'test user' },
    });
    userIdx = user.idx;
    test.setUserIdx(userIdx);

    await prisma.place.deleteMany({ where: { tel: '010-1234-567' } });
    const place = await prisma.place.create({
      data: {
        name: 'test place',
        tel: '010-1234-567',
        address: '123 test street',
        addressX: 35.444,
        addressY: 56.777,
      },
    });
    placeIdx = place.idx;

    await prisma.keyword.deleteMany({
      where: { content: { in: ['cozy', 'tasty', 'quiet'] } },
    });
    await prisma.keyword.createMany({
      data: [{ content: 'cozy' }, { content: 'tasty' }, { content: 'quiet' }],
    });

    keywordIdxList = (
      await prisma.keyword.findMany({
        where: { content: { in: ['cozy', 'tasty', 'quiet'] } },
        select: { idx: true },
      })
    ).map((k) => k.idx);

    imagePathList = [
      'images/review/1/20240312/171923.jpg',
      'images/review/1/20240312/17234.jpg',
    ];
  });

  beforeEach(async () => {
    await test.startTransaction();
    const prisma = app.get(PrismaService);

    const review = await prisma.review.create({
      data: {
        userIdx,
        placeIdx,
        content: 'initial content',
        reviewKeywordMapping: {
          create: keywordIdxList
            .slice(0, 2)
            .map((keywordIdx) => ({ keywordIdx })),
        },
        reviewImage: {
          create: imagePathList.map((path) => ({ path })),
        },
      },
    });
    reviewIdx = review.idx;
  });

  afterEach(() => {
    test.rollbackTransaction();
  });

  afterAll(async () => {
    await test.close();
  });

  describe('GET /place/:placeIdx/review/all', () => {
    it('should return reviewList of a place', async () => {
      const response = await request(app.getHttpServer())
        .get(`/place/${placeIdx}/review/all`)
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return an empty reviewList of a place', async () => {
      const prisma = app.get(PrismaService);
      await prisma.review.update({
        where: {
          idx: reviewIdx,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/place/${placeIdx}/review/all`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 404 if placeIdx dose not exist', async () => {
      await request(app.getHttpServer())
        .get('/place/999/review/all')
        .expect(404);
    });

    it('should return 400 if placeIdx is not number', async () => {
      await request(app.getHttpServer())
        .get('/place/test/review/all')
        .expect(400);
    });
  });

  describe('POST /place/:placeIdx/review', () => {
    it('should create a review without keyword and image', async () => {
      const response = await request(app.getHttpServer())
        .post(`/place/${placeIdx}/review`)
        .send({ content: 'good taste' })
        .expect(201);

      expect(response.body).toHaveProperty('idx');
      expect(response.body.content).toBe('good taste');
      expect(response.body.keywordList).toEqual([]);
      expect(response.body.imagePathList).toEqual([]);
    });

    it('should create a review with keyword and image', async () => {
      const response = await request(app.getHttpServer())
        .post(`/place/${placeIdx}/review`)
        .send({
          content: 'good taste',
          keywordIdxList: [keywordIdxList[0], keywordIdxList[1]],
          imagePathList,
        })
        .expect(201);

      expect(response.body).toHaveProperty('idx');
      expect(response.body.content).toBe('good taste');
      expect(response.body.imagePathList).toEqual(imagePathList);
      expect(response.body.keywordList).toEqual(['cozy', 'tasty']);
    });

    // it('should return 400 if keywordIdxList contains invalid keyword', async () => {
    //   const invalidKeywordIdxList = [999];
    //   await request(app.getHttpServer())
    //     .post(`/place/${placeIdx}/review`)
    //     .send({
    //       content: 'good taste',
    //       keywordIdxList: invalidKeywordIdxList,
    //     })
    //     .expect(400);
    // });

    it('should return 400 if placeIdx is not a number', async () => {
      await request(app.getHttpServer())
        .post(`/place/test/review`)
        .send({
          content: 'good taste',
        })
        .expect(400);
    });

    it('should return 400 if the request body is invalid', async () => {
      await request(app.getHttpServer())
        .post(`/place/${placeIdx}/review`)
        .send({})
        .expect(400);
    });
  });

  describe('PATCH /review/:reviewIdx', () => {
    it('should update a review', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({
          content: 'Very quiet',
          imagePathList: ['images/new_review_image.jpg'],
          keywordIdxList: [keywordIdxList[2], keywordIdxList[1]],
        })
        .expect(200);

      expect(response.body.content).toBe('Very quiet');
      expect(response.body.imagePathList).toEqual([
        'images/new_review_image.jpg',
      ]);
      expect(response.body.keywordList).toEqual(['tasty', 'quiet']);
    });

    it('should update a review content only', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({ content: 'Very quiet' })
        .expect(200);

      expect(response.body.content).toBe('Very quiet');
      expect(response.body.imagePathList).toEqual(imagePathList);
      expect(response.body.keywordList).toEqual(['cozy', 'tasty']);
    });

    it('should update a review image only', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({ imagePathList: ['images/new_review_image.jpg'] })
        .expect(200);

      expect(response.body.imagePathList).toEqual([
        'images/new_review_image.jpg',
      ]);
      expect(response.body.content).toBe('initial content');
      expect(response.body.keywordList).toEqual(['cozy', 'tasty']);
    });

    it('should remove a review image only', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({ imagePathList: [] })
        .expect(200);

      expect(response.body.imagePathList).toEqual([]);
      expect(response.body.content).toBe('initial content');
      expect(response.body.keywordList).toEqual(['cozy', 'tasty']);
    });

    it('should update a review keyword list only', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({ keywordIdxList: [keywordIdxList[1], keywordIdxList[2]] })
        .expect(200);

      expect(response.body.keywordList).toEqual(['tasty', 'quiet']);
      expect(response.body.content).toBe('initial content');
      expect(response.body.imagePathList).toEqual(imagePathList);
    });

    it('should remove a keyword list only', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({ keywordIdxList: [] })
        .expect(200);

      expect(response.body.keywordList).toEqual([]);
      expect(response.body.content).toBe('initial content');
      expect(response.body.imagePathList).toEqual(imagePathList);
    });

    it('should return 400 if reviewIdx is not a number', async () => {
      await request(app.getHttpServer())
        .patch(`/review/test`)
        .send({
          content: 'good taste',
        })
        .expect(400);
    });

    it('should return 400 if the request body is invalid', async () => {
      await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({
          content: 'hi',
        })
        .expect(400);
    });

    it('should return 403 if the user is not authorized', async () => {
      const prisma = app.get(PrismaService);
      const unauthorizedUser = await prisma.user.create({
        data: { nickname: 'unauthorized user' },
      });
      test.setUserIdx(unauthorizedUser.idx);

      await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({
          content: 'taste good',
        })
        .expect(403);

      test.setUserIdx(userIdx);
    });

    it('should return 404 if the review does not exist', async () => {
      await request(app.getHttpServer())
        .patch(`/review/9999`)
        .send({
          content: 'taste good',
        })
        .expect(404);
    });
  });

  describe('DELETE /review/:reviewIdx', () => {
    it('should delete a review', async () => {
      const prisma = app.get(PrismaService);
      let review = await prisma.review.findUnique({
        where: { idx: reviewIdx },
      });
      expect(review?.deletedAt).toBeNull();

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}`)
        .expect(200);

      review = await prisma.review.findUnique({
        where: { idx: reviewIdx },
      });

      expect(review?.deletedAt).not.toBeNull();
    });

    it('should return 400 if reviewIdx is not a number', async () => {
      await request(app.getHttpServer()).delete(`/review/test`).expect(400);
    });

    it('should return 403 if the user is not authorized to delete the review', async () => {
      const prisma = app.get(PrismaService);
      const unauthorizedUser = await prisma.user.create({
        data: { nickname: 'unauthorized user' },
      });
      test.setUserIdx(unauthorizedUser.idx);

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}`)
        .expect(403);

      test.setUserIdx(userIdx);
    });

    it('should return 404 if the review does not exist', async () => {
      await request(app.getHttpServer()).delete(`/review/9999`).expect(404);
    });
  });

  describe('GET /my/review/all', () => {
    it('should return reviewList of a user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/my/review/all`)
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return an empty reviewList of a user', async () => {
      const prisma = app.get(PrismaService);

      await prisma.review.update({
        where: {
          idx: reviewIdx,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/my/review/all`)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });
});
