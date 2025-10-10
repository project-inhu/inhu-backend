import { MagazineCoreService } from '@libs/core/magazine/magazine-core.service';
import { Injectable } from '@nestjs/common';
import { MagazineEntity } from './entity/magazine.entity';
import { BookmarkCoreService } from '@libs/core/bookmark/bookmark-core.service';
import { LoginUser } from '@user/common/types/LoginUser';
import { MagazineOverviewEntity } from './entity/magazine-overview.entity';
import { GetAllMagazineOverviewDto } from './dto/request/get-all-magazine-overview.dto';

@Injectable()
export class MagazineService {
  constructor(
    private readonly magazineCoreService: MagazineCoreService,
    private readonly bookmarkCoreService: BookmarkCoreService,
  ) {}

  // ! 가게 정보가 사라졌을 때 메거진에서는 어떻게 해야 되나?
  public async getMagazineByIdx(
    idx: number,
    loginUser?: LoginUser,
  ): Promise<MagazineEntity | null> {
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);

    if (!loginUser) {
      return magazine && MagazineEntity.fromModel(magazine, []);
    }

    if (!magazine) {
      return null;
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
}
