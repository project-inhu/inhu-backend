import { INestApplication } from '@nestjs/common';
import { ReviewEntity } from 'src/api/review/entity/review.entity';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import * as request from 'supertest';
import { TestManager } from 'test/common/helpers/test-manager';
import { ReviewSeedHelper } from 'test/common/seed/review-seed.helper';
import {
  getRandomContent,
  getRandomImagePathList,
  getRandomInt,
  getRandomKeywordPairList,
} from 'test/common/seed/utils/random-utils';

describe('ReviewController', () => {
  let app: INestApplication;
  let test = TestManager.create();
  let reviewSeedHelper: ReviewSeedHelper;
  let reviews: ReviewEntity[] = [];
  let reviewIdx: number;
  let placeIdx: number;
  let userIdx: number;
  let placeName: string;
  let userNickName: string;
  let createdAt: Date;
  let content: string;
  let keywordList: string[];
  let imagePathList: string[];

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
    placeIdx = review.placeIdx;
    placeName = review.placeName;
    userIdx = review.userIdx;
    userNickName = review.userNickName;
    createdAt = review.createdAt;
    content = review.content;
    imagePathList = review.imagePathList;
    keywordList = review.keywordList;

    reviews.push(review);

    test.setUserIdx(userIdx);
  });

  afterEach(() => {
    test.rollbackTransaction();
  });

  afterAll(async () => {
    await test.close();
  });

  describe('GET /place/:placeIdx/review/all', () => {
    it('should return reviewList of a place', async () => {
      for (let i = 0; i < 2; i++) {
        const keywordIdxList = (
          await getRandomKeywordPairList(app.get(PrismaService))
        ).map((k) => k.idx);

        const review = await reviewSeedHelper.seed({
          placeIdx,
          content: getRandomContent(),
          imagePathList: getRandomImagePathList(),
          keywordIdxList,
        });

        reviews.push(review);
      }

      const response = await request(app.getHttpServer())
        .get(`/place/${placeIdx}/review/all`)
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);

      response.body.forEach((review: ReviewEntity) => {
        const reviewEntity = reviews.find((r) => r.idx === review.idx);

        expect(reviewEntity).toBeDefined();

        if (reviewEntity) {
          expect(review.idx).toBe(reviewEntity.idx);
          expect(review.content).toBe(reviewEntity.content);
          expect(review.imagePathList).toEqual(reviewEntity.imagePathList);
          expect(review.keywordList).toEqual(reviewEntity.keywordList);
          expect(review.userNickName).toBe(reviewEntity.userNickName);
          expect(review.placeName).toBe(reviewEntity.placeName);
          expect(new Date(review.createdAt).toISOString().slice(0, 16)).toBe(
            new Date(createdAt).toISOString().slice(0, 16),
          );
        }
      });
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

    it('should return 404 if the place dose not exist', async () => {
      await request(app.getHttpServer())
        .get('/place/999/review/all')
        .expect(404);
    });

    it('should return 400 if the placeIdx is not number', async () => {
      await request(app.getHttpServer())
        .get('/place/test/review/all')
        .expect(400);
    });
  });

  describe('POST /place/:placeIdx/review', () => {
    it('should create a review without keyword and image', async () => {
      content = getRandomContent();

      const response = await request(app.getHttpServer())
        .post(`/place/${placeIdx}/review`)
        .send({ content })
        .expect(201);

      expect(response.body).toHaveProperty('idx');
      expect(response.body.userIdx).toBe(userIdx);
      expect(response.body.placeIdx).toBe(placeIdx);
      expect(response.body.content).toBe(content);
      expect(response.body.keywordList).toEqual([]);
      expect(response.body.imagePathList).toEqual([]);
      expect(typeof response.body.createdAt).toBe('string');
      expect(new Date(response.body.createdAt).getTime()).not.toBeNaN();
      expect(typeof response.body.userNickName).toBe('string');
      expect(typeof response.body.placeName).toBe('string');
    });

    it('should create a review with keyword and image', async () => {
      content = getRandomContent();
      const keywordPairList = await getRandomKeywordPairList(
        app.get(PrismaService),
      );
      const keywordIdxList = keywordPairList.map((k) => k.idx);
      keywordList = keywordPairList.map((k) => k.content);
      imagePathList = getRandomImagePathList();

      const response = await request(app.getHttpServer())
        .post(`/place/${placeIdx}/review`)
        .send({
          content,
          keywordIdxList,
          imagePathList,
        })
        .expect(201);

      expect(response.body).toHaveProperty('idx');
      expect(response.body.userIdx).toBe(userIdx);
      expect(response.body.placeIdx).toBe(placeIdx);
      expect(response.body.content).toBe(content);
      expect(response.body.keywordList).toEqual(keywordList);
      expect(response.body.imagePathList).toEqual(imagePathList);
      expect(typeof response.body.createdAt).toBe('string');
      expect(new Date(response.body.createdAt).getTime()).not.toBeNaN();
      expect(typeof response.body.userNickName).toBe('string');
      expect(typeof response.body.placeName).toBe('string');
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

    it('should return 400 if the placeIdx is not a number', async () => {
      await request(app.getHttpServer())
        .post(`/place/test/review`)
        .send({
          content: getRandomContent(),
        })
        .expect(400);
    });

    it('should return 400 if the request body is invalid', async () => {
      await request(app.getHttpServer())
        .post(`/place/${placeIdx}/review`)
        .send({})
        .expect(400);
    });

    it('should return 404 if the place dose not exist', async () => {
      await request(app.getHttpServer())
        .post('/place/999/review/all')
        .expect(404);
    });
  });

  describe('PATCH /review/:reviewIdx', () => {
    it('should update a review', async () => {
      content = getRandomContent();
      const keywordPairList = await getRandomKeywordPairList(
        app.get(PrismaService),
      );

      const keywordIdxList = keywordPairList.map((k) => k.idx);
      keywordList = keywordPairList.map((k) => k.content);
      imagePathList = getRandomImagePathList();

      const response = await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({
          content,
          imagePathList,
          keywordIdxList,
        })
        .expect(200);

      expect(response.body).toHaveProperty('idx');
      expect(response.body.userIdx).toBe(userIdx);
      expect(response.body.placeIdx).toBe(placeIdx);
      expect(response.body.content).toBe(content);
      expect(new Date(response.body.createdAt).toISOString().slice(0, 16)).toBe(
        new Date(createdAt).toISOString().slice(0, 16),
      );
      expect(response.body.keywordList).toEqual(keywordList);
      expect(response.body.imagePathList).toEqual(imagePathList);
      expect(response.body.userNickName).toBe(userNickName);
      expect(response.body.placeName).toBe(placeName);
    });

    it('should update a review content only', async () => {
      content = getRandomContent();
      const response = await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({ content })
        .expect(200);

      expect(response.body).toHaveProperty('idx');
      expect(response.body.userIdx).toBe(userIdx);
      expect(response.body.placeIdx).toBe(placeIdx);
      expect(response.body.content).toBe(content);
      expect(new Date(response.body.createdAt).toISOString().slice(0, 16)).toBe(
        new Date(createdAt).toISOString().slice(0, 16),
      );
      expect(response.body.keywordList).toEqual(keywordList);
      expect(response.body.imagePathList).toEqual(imagePathList);
      expect(response.body.userNickName).toBe(userNickName);
      expect(response.body.placeName).toBe(placeName);
    });

    it('should update a review image only', async () => {
      imagePathList = getRandomImagePathList();
      const response = await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({ imagePathList })
        .expect(200);

      expect(response.body).toHaveProperty('idx');
      expect(response.body.userIdx).toBe(userIdx);
      expect(response.body.placeIdx).toBe(placeIdx);
      expect(response.body.content).toBe(content);
      expect(new Date(response.body.createdAt).toISOString().slice(0, 16)).toBe(
        new Date(createdAt).toISOString().slice(0, 16),
      );
      expect(response.body.keywordList).toEqual(keywordList);
      expect(response.body.imagePathList).toEqual(imagePathList);
      expect(response.body.userNickName).toBe(userNickName);
      expect(response.body.placeName).toBe(placeName);
    });

    it('should remove a review image only', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({ imagePathList: [] })
        .expect(200);

      expect(response.body).toHaveProperty('idx');
      expect(response.body.userIdx).toBe(userIdx);
      expect(response.body.placeIdx).toBe(placeIdx);
      expect(response.body.content).toBe(content);
      expect(new Date(response.body.createdAt).toISOString().slice(0, 16)).toBe(
        new Date(createdAt).toISOString().slice(0, 16),
      );
      expect(response.body.keywordList).toEqual(keywordList);
      expect(response.body.imagePathList).toEqual([]);
      expect(response.body.userNickName).toBe(userNickName);
      expect(response.body.placeName).toBe(placeName);
    });

    it('should update a review keyword list only', async () => {
      const keywordPairList = await getRandomKeywordPairList(
        app.get(PrismaService),
      );
      const keywordIdxList = keywordPairList.map((k) => k.idx);
      keywordList = keywordPairList.map((k) => k.content);

      const response = await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({ keywordIdxList })
        .expect(200);

      expect(response.body).toHaveProperty('idx');
      expect(response.body.userIdx).toBe(userIdx);
      expect(response.body.placeIdx).toBe(placeIdx);
      expect(response.body.content).toBe(content);
      expect(new Date(response.body.createdAt).toISOString().slice(0, 16)).toBe(
        new Date(createdAt).toISOString().slice(0, 16),
      );
      expect(response.body.keywordList).toEqual(keywordList);
      expect(response.body.imagePathList).toEqual(imagePathList);
      expect(response.body.userNickName).toBe(userNickName);
      expect(response.body.placeName).toBe(placeName);
    });

    it('should remove a keyword list only', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({ keywordIdxList: [] })
        .expect(200);

      expect(response.body).toHaveProperty('idx');
      expect(response.body.userIdx).toBe(userIdx);
      expect(response.body.placeIdx).toBe(placeIdx);
      expect(response.body.content).toBe(content);
      expect(new Date(response.body.createdAt).toISOString().slice(0, 16)).toBe(
        new Date(createdAt).toISOString().slice(0, 16),
      );
      expect(response.body.keywordList).toEqual([]);
      expect(response.body.imagePathList).toEqual(imagePathList);
      expect(response.body.userNickName).toBe(userNickName);
      expect(response.body.placeName).toBe(placeName);
    });

    it('should return 400 if the reviewIdx is not a number', async () => {
      await request(app.getHttpServer())
        .patch(`/review/test`)
        .send({
          content: getRandomImagePathList(),
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
      test.setUserIdx(2);

      await request(app.getHttpServer())
        .patch(`/review/${reviewIdx}`)
        .send({
          content: getRandomContent(),
        })
        .expect(403);
    });

    it('should return 404 if the review does not exist', async () => {
      await request(app.getHttpServer())
        .patch(`/review/9999`)
        .send({
          content: getRandomContent(),
        })
        .expect(404);
    });
  });

  describe('DELETE /review/:reviewIdx', () => {
    it('should delete a review', async () => {
      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}`)
        .expect(200);

      const prisma = app.get(PrismaService);
      const review = await prisma.review.findUnique({
        where: { idx: reviewIdx },
      });

      expect(review).toBeDefined();
      expect(review!.deletedAt).not.toBeNull();
    });

    it('should return 400 if the reviewIdx is not a number', async () => {
      await request(app.getHttpServer()).delete(`/review/test`).expect(400);
    });

    it('should return 403 if the user is not authorized to delete the review', async () => {
      test.setUserIdx(2);

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}`)
        .expect(403);
    });

    it('should return 404 if the review does not exist', async () => {
      await request(app.getHttpServer()).delete(`/review/9999`).expect(404);
    });
  });

  describe('GET /my/review/all', () => {
    it('should return reviewList of a user', async () => {
      const review1 = await reviewSeedHelper.seed({ userIdx });
      const review2 = await reviewSeedHelper.seed({ userIdx });

      reviews.push(review1, review2);

      const response = await request(app.getHttpServer())
        .get(`/my/review/all`)
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);

      response.body.forEach((review: ReviewEntity) => {
        const reviewEntity = reviews.find((r) => r.idx === review.idx);

        expect(reviewEntity).toBeDefined();

        if (reviewEntity) {
          expect(review.idx).toBe(reviewEntity.idx);
          expect(review.content).toBe(reviewEntity.content);
          expect(review.imagePathList).toEqual(reviewEntity.imagePathList);
          expect(review.keywordList).toEqual(reviewEntity.keywordList);
          expect(review.userNickName).toBe(reviewEntity.userNickName);
          expect(review.placeName).toBe(reviewEntity.placeName);
          expect(new Date(review.createdAt).toISOString().slice(0, 16)).toBe(
            new Date(createdAt).toISOString().slice(0, 16),
          );
        }
      });
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
