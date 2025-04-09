import { INestApplication } from '@nestjs/common';
import { Review } from '@prisma/client';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import * as request from 'supertest';
import { TestManager } from 'test/common/helpers/test-manager';
import { ReviewSeedHelper } from 'test/common/seed/review-seed.helper';

describe('ReviewController', () => {
  let app: INestApplication;
  let test = TestManager.create();
  let reviewSeedHelper: ReviewSeedHelper;
  let reviewIdx: number;
  let placeIdx: number;
  let userIdx: number;
  let keywordIdxList: number[];
  let keywordContentMap: Map<number, string>;
  let imagePathList: string[];
  let originalKeywordContentList: string[];

  beforeAll(async () => {
    await test.init();
    app = test.getApp();

    const prisma = app.get(PrismaService);
    reviewSeedHelper = new ReviewSeedHelper(prisma);
  });

  beforeEach(async () => {
    await test.startTransaction();
    const review = await reviewSeedHelper.seed();
    reviewIdx = review.idx;
    placeIdx = review.place.idx;
    userIdx = review.user.idx;

    keywordIdxList = review.reviewKeywordMapping.map(
      (mapping) => mapping.keyword.idx,
    );
    keywordContentMap = new Map(
      review.reviewKeywordMapping.map((m) => [
        m.keyword.idx,
        m.keyword.content,
      ]),
    );
    imagePathList = review.reviewImage.map((image) => image.path);
    originalKeywordContentList = review.reviewKeywordMapping
      .sort((a, b) => a.keyword.idx - b.keyword.idx)
      .map((m) => m.keyword.content);

    test.setUserIdx(userIdx);
  });

  function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomSubset<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

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
      const count = getRandomInt(1, keywordIdxList.length);
      const selectedKeywordIdxList = getRandomSubset(keywordIdxList, count);

      const sortedKeywordIdxList = [...selectedKeywordIdxList].sort(
        (a, b) => a - b,
      );
      const expectedKeywordList = sortedKeywordIdxList.map((idx) =>
        keywordContentMap.get(idx),
      );

      const response = await request(app.getHttpServer())
        .post(`/place/${placeIdx}/review`)
        .send({
          content: 'good taste',
          keywordIdxList: selectedKeywordIdxList,
          imagePathList,
        })
        .expect(201);

      expect(response.body).toHaveProperty('idx');
      expect(response.body.content).toBe('good taste');
      expect(response.body.imagePathList).toEqual(imagePathList);
      expect(response.body.keywordList).toEqual(expectedKeywordList);
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
      const count = getRandomInt(1, keywordIdxList.length);
      const selectedKeywordIdxList = getRandomSubset(keywordIdxList, count);
      const sortedKeywordIdxList = [...selectedKeywordIdxList].sort(
        (a, b) => a - b,
      );
      const expectedKeywordList = sortedKeywordIdxList.map((idx) =>
        keywordContentMap.get(idx),
      );

      const response = await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({
          content: 'Very quiet',
          imagePathList: ['images/new_review_image.jpg'],
          keywordIdxList: selectedKeywordIdxList,
        })
        .expect(200);

      expect(response.body.content).toBe('Very quiet');
      expect(response.body.imagePathList).toEqual([
        'images/new_review_image.jpg',
      ]);
      expect(response.body.keywordList).toEqual(expectedKeywordList);
    });

    it('should update a review content only', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({ content: 'Very quiet' })
        .expect(200);

      expect(response.body.content).toBe('Very quiet');
      expect(response.body.imagePathList).toEqual(imagePathList);
      expect(response.body.keywordList).toEqual(originalKeywordContentList);
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
      expect(response.body.keywordList).toEqual(originalKeywordContentList);
    });

    it('should remove a review image only', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({ imagePathList: [] })
        .expect(200);

      expect(response.body.imagePathList).toEqual([]);
      expect(response.body.content).toBe('initial content');
      expect(response.body.keywordList).toEqual(originalKeywordContentList);
    });

    it('should update a review keyword list only', async () => {
      const selectedKeywordIdxList = getRandomSubset(keywordIdxList, 2);
      const sortedKeywordIdxList = [...selectedKeywordIdxList].sort(
        (a, b) => a - b,
      );
      const expectedKeywordList = sortedKeywordIdxList.map((idx) =>
        keywordContentMap.get(idx),
      );

      const response = await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({ keywordIdxList: selectedKeywordIdxList })
        .expect(200);

      expect(response.body.keywordList).toEqual(expectedKeywordList);
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
