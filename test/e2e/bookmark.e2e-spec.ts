import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { TestManager } from 'test/common/helpers/test-manager';
import { BookmarkSeedHelper } from 'test/common/seed/bookmark-seed.helper';

describe('BookmarkController', () => {
  let app: INestApplication;
  let test = TestManager.create();
  let bookmarkSeedHelper: BookmarkSeedHelper;
  let bookmarkIdx: number;
  let placeIdx: number;
  let userIdx: number;
  let createdAt: Date;

  beforeAll(async () => {
    await test.init();
    app = test.getApp();

    const prisma = app.get(PrismaService);
    bookmarkSeedHelper = new BookmarkSeedHelper(prisma);
  });

  beforeEach(async () => {
    await test.startTransaction();

    const bookmark = await bookmarkSeedHelper.seed();

    bookmarkIdx = bookmark.idx;
    placeIdx = bookmark.placeIdx;
    userIdx = bookmark.userIdx;
    createdAt = bookmark.createdAt;

    test.setUserIdx(userIdx);
  });

  afterEach(() => {
    test.rollbackTransaction();
  });

  afterAll(async () => {
    await test.close();
  });

  describe('POST /place/:placeIdx/bookmark', () => {
    it('should create a bookmark for the first time', async () => {
      const newPlaceIdx = 2;
      const response = await request(app.getHttpServer())
        .post(`/place/${newPlaceIdx}/bookmark`)
        .expect(201);

      expect(response.body).toHaveProperty('idx');
      expect(response.body.userIdx).toEqual(userIdx);
      expect(response.body.placeIdx).toEqual(newPlaceIdx);
      expect(new Date(response.body.createdAt).toISOString().slice(0, 16)).toBe(
        new Date(createdAt).toISOString().slice(0, 16),
      );
    });

    it('should recreate a bookmark that previously deleted', async () => {
      const prisma = app.get(PrismaService);
      await prisma.bookmark.update({
        where: { idx: bookmarkIdx },
        data: { deletedAt: new Date() },
      });

      const response = await request(app.getHttpServer())
        .post(`/place/${placeIdx}/bookmark`)
        .expect(201);

      expect(response.body).toHaveProperty('idx');
      expect(response.body.userIdx).toEqual(userIdx);
      expect(response.body.placeIdx).toEqual(placeIdx);
      expect(new Date(response.body.createdAt).toISOString().slice(0, 16)).toBe(
        new Date(createdAt).toISOString().slice(0, 16),
      );
    });

    it('should return 400 if the placeIdx is not a number', async () => {
      await request(app.getHttpServer())
        .post(`/place/test/bookmark`)
        .expect(400);
    });

    it('should return 404 if the place does not exist', async () => {
      await request(app.getHttpServer())
        .post(`/place/999/bookmark`)
        .expect(404);
    });

    it('should return 409 if the bookmark already exists', async () => {
      await request(app.getHttpServer())
        .post(`/place/${placeIdx}/bookmark`)
        .expect(409);
    });
  });

  describe('DELETE /place/:placeIdx/bookmark', () => {
    it('should delete a bookmark', async () => {
      await request(app.getHttpServer())
        .delete(`/place/${placeIdx}/bookmark`)
        .expect(200);
    });

    it('should return 400 if the placeIdx is not a number', async () => {
      await request(app.getHttpServer())
        .delete(`/place/test/bookmark`)
        .expect(400);
    });

    it('should return 404 if the place does not exist', async () => {
      await request(app.getHttpServer())
        .delete(`/place/999/bookmark`)
        .expect(404);
    });

    it('should return 409 if the bookmark already deleted', async () => {
      const prisma = app.get(PrismaService);
      await prisma.bookmark.update({
        where: { idx: bookmarkIdx },
        data: { deletedAt: new Date() },
      });

      await request(app.getHttpServer())
        .delete(`/place/${placeIdx}/bookmark`)
        .expect(409);
    });
  });

  describe('DELETE /bookmark/:bookmarkIdx', () => {
    it('should delete a bookmark', async () => {
      await request(app.getHttpServer())
        .delete(`/bookmark/${bookmarkIdx}`)
        .expect(200);
    });

    it('should return 400 if the bookmarkIdx is not a number', async () => {
      await request(app.getHttpServer()).delete(`/bookmark/test`).expect(400);
    });

    it('should return 404 if the bookmark does not exist', async () => {
      await request(app.getHttpServer()).delete(`/bookmark/999`).expect(404);
    });

    it('should return 409 if the bookmark already deleted', async () => {
      const prisma = app.get(PrismaService);
      await prisma.bookmark.update({
        where: { idx: bookmarkIdx },
        data: { deletedAt: new Date() },
      });

      await request(app.getHttpServer())
        .delete(`/bookmark/${bookmarkIdx}`)
        .expect(409);
    });
  });
});
