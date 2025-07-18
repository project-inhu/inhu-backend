import { SelectBookmark } from './prisma-type/select-bookmark';

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
