import { MagazineCoreService } from '@libs/core/magazine/magazine-core.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MagazineEntity } from './entity/magazine.entity';
import { BookmarkCoreService } from '@libs/core/bookmark/bookmark-core.service';
import { LoginUser } from '@user/common/types/LoginUser';
import { MagazineOverviewEntity } from './entity/magazine-overview.entity';
import { GetAllMagazineDto } from './dto/request/get-all-magazine.dto';
import { Transactional } from '@nestjs-cls/transactional';
import { GetAllMagazineResponseDto } from './dto/response/get-all-magazine-response.dto';
import { GetAllLikedMagazineDto } from './dto/request/get-all-liked-magazine.dto';
import { GetAllLikedMagazineResponseDto } from './dto/response/get-all-liked-magazine-response.dto';

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
  ): Promise<MagazineEntity> {
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);
    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${idx}`);
    }

    await this.magazineCoreService.increaseMagazineViewCount(idx);
    magazine.viewCount += 1;

    if (!loginUser) {
      return MagazineEntity.fromModel(magazine, []);
    }

    const bookmarkedPlaceList = await this.bookmarkCoreService
      .getBookmarkStateByUserIdx({
        userIdx: loginUser.idx,
        placeIdxList: magazine.placeList.map((place) => place.idx),
      })
      .then((bookmarks) => bookmarks.map((bookmark) => bookmark.placeIdx));

    return MagazineEntity.fromModel(magazine, bookmarkedPlaceList);
  }

  public async getMagazineAll(
    dto: GetAllMagazineDto,
  ): Promise<GetAllMagazineResponseDto> {
    const TAKE = 10;
    const SKIP = (dto.page - 1) * TAKE;

    const magazineOverviewModelList =
      await this.magazineCoreService.getMagazineAll({
        take: TAKE + 1,
        skip: SKIP,
        activated: true,
        orderBy: dto.orderBy,
      });

    return {
      magazineList: magazineOverviewModelList
        .slice(0, TAKE)
        .map(MagazineOverviewEntity.fromModel),
      hasNext: magazineOverviewModelList.length > TAKE,
    };
  }

  public async getLikedMagazineAllByUserIdx(
    dto: GetAllLikedMagazineDto,
    userIdx: number,
  ): Promise<GetAllLikedMagazineResponseDto> {
    const TAKE = 10;
    const SKIP = (dto.page - 1) * TAKE;

    const likedMagazineOverviewModelList =
      await this.magazineCoreService.getLikedMagazineAllByUserIdx({
        userIdx,
        take: TAKE + 1,
        skip: SKIP,
        activated: true,
        orderBy: dto.orderBy,
      });

    return {
      magazineList: likedMagazineOverviewModelList
        .slice(0, TAKE)
        .map(MagazineOverviewEntity.fromModel),
      hasNext: likedMagazineOverviewModelList.length > TAKE,
    };
  }
}
