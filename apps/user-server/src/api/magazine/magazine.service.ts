import { MagazineCoreService } from '@libs/core/magazine/magazine-core.service';
import { Injectable } from '@nestjs/common';
import { MagazineEntity } from './entity/magazine.entity';
import { BookmarkCoreService } from '@libs/core/bookmark/bookmark-core.service';
import { LoginUser } from '@user/common/types/LoginUser';
import { MagazineOverviewEntity } from './entity/magazine-overview.entity';
import { GetAllMagazineOverviewDto } from './dto/request/get-all-magazine-overview.dto';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class MagazineService {
  constructor(
    private readonly magazineCoreService: MagazineCoreService,
    private readonly bookmarkCoreService: BookmarkCoreService,
  ) {}

  @Transactional()
  public async getMagazineByIdx(
    idx: number,
    loginUser?: LoginUser,
  ): Promise<MagazineEntity | null> {
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);
    if (!magazine) {
      return null;
    }

    await this.magazineCoreService.increaseMagazineViewCount(idx);

    if (!loginUser) {
      return MagazineEntity.fromModel(magazine, []);
    }

    const bookmarkedPlaceList = await this.bookmarkCoreService
      .getBookmarkStateByUserIdx({
        userIdx: loginUser.idx,
        placeIdxList: magazine.placeList.map((place) => place.idx),
      })
      .then((bookmarks) => bookmarks.map((bookmark) => bookmark.placeIdx));

    return magazine && MagazineEntity.fromModel(magazine, bookmarkedPlaceList);
  }

  public async getMagazineOverviewAll(
    dto: GetAllMagazineOverviewDto,
  ): Promise<MagazineOverviewEntity[]> {
    return (await this.magazineCoreService.getMagazineOverviewAll(dto)).map(
      MagazineOverviewEntity.fromModel,
    );
  }

  public async likeMagazineByIdx(idx: number): Promise<void> {
    await this.magazineCoreService.increaseMagazineLikeCount(idx);
  }

  public async unlikeMagazineByIdx(idx: number): Promise<void> {
    await this.magazineCoreService.decreaseMagazineLikeCount(idx);
  }
}
