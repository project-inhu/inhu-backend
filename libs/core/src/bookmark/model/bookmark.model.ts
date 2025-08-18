import { SelectBookmark } from './prisma-type/select-bookmark';

/**
 * 북마크 모델 클래스
 *
 * @publicApi
 */
export class BookmarkModel {
  public userIdx: number;
  public placeIdx: number;
  public createdAt: Date;

  constructor(data: BookmarkModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(bookmark: SelectBookmark): BookmarkModel {
    return new BookmarkModel({
      userIdx: bookmark.userIdx,
      placeIdx: bookmark.placeIdx,
      createdAt: bookmark.createdAt,
    });
  }
}
