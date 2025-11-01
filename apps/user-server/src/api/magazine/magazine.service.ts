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
import { MagazineLikeCoreService } from '@libs/core/magazine-like/magazine-like-core.service';
import { MagazineLikeEntity } from './entity/magazine-like.entity';

@Injectable()
export class MagazineService {
  constructor(
    private readonly magazineCoreService: MagazineCoreService,
    private readonly bookmarkCoreService: BookmarkCoreService,
    private readonly magazineLikeCoreService: MagazineLikeCoreService,
  ) {}

  @Transactional()
  public async getMagazineByIdx(
    magazineIdx: number,
    loginUser?: LoginUser,
  ): Promise<MagazineEntity> {
    const magazine =
      await this.magazineCoreService.getMagazineByIdx(magazineIdx);
    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${magazineIdx}`);
    }

    await this.magazineCoreService.increaseMagazineViewCount(magazineIdx);
    magazine.viewCount += 1;

    if (!loginUser?.idx) {
      return MagazineEntity.fromModel(magazine, [], false);
    }

    const bookmarkedPlaceList = await this.bookmarkCoreService
      .getBookmarkStateByUserIdx({
        userIdx: loginUser.idx,
        placeIdxList: magazine.placeList.map((place) => place.idx),
      })
      .then((bookmarks) => bookmarks.map((bookmark) => bookmark.placeIdx));

    const magazineLikeModel =
      await this.magazineLikeCoreService.getMagazineLikeByIdx(
        loginUser.idx,
        magazineIdx,
      );

    return MagazineEntity.fromModel(
      magazine,
      bookmarkedPlaceList,
      magazineLikeModel !== null,
    );
  }

  public async getMagazineAll(
    dto: GetAllMagazineDto,
    loginUser?: LoginUser,
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

    const paginatedList = magazineOverviewModelList.slice(0, TAKE);
    const hasNext = magazineOverviewModelList.length > TAKE;

    if (!loginUser?.idx) {
      return {
        magazineList: paginatedList.map((magazine) =>
          MagazineOverviewEntity.fromModel(magazine, false),
        ),
        hasNext,
      };
    }

    const magazineLikeIdxList = await this.magazineLikeCoreService
      .getMagazineLikeAllByUserIdxAndMagazineIdxList(
        loginUser.idx,
        paginatedList.map((magazine) => magazine.idx),
      )
      .then((likes) => likes.map((like) => like.magazineIdx));

    return {
      magazineList: magazineOverviewModelList
        .slice(0, TAKE)
        .map((magazine) =>
          MagazineOverviewEntity.fromModel(
            magazine,
            magazineLikeIdxList.includes(magazine.idx),
          ),
        ),
      hasNext: hasNext,
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
        .map((magazine) => MagazineOverviewEntity.fromModel(magazine, true)),
      hasNext: likedMagazineOverviewModelList.length > TAKE,
    };
  }

  public async likeMagazineByIdx(
    loginUser: LoginUser,
    magazineIdx: number,
  ): Promise<MagazineLikeEntity> {
    const magazine =
      await this.magazineCoreService.getMagazineByIdx(magazineIdx);
    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${magazineIdx}`);
    }

    return MagazineLikeEntity.fromModel(
      await this.magazineLikeCoreService.createMagazineLikeByIdx(
        magazineIdx,
        loginUser.idx,
      ),
    );
  }

  public async unlikeMagazineByIdx(
    loginUser: LoginUser,
    magazineIdx: number,
  ): Promise<void> {
    const magazine =
      await this.magazineCoreService.getMagazineByIdx(magazineIdx);
    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${magazineIdx}`);
    }

    if (magazine.likeCount === 0) {
      return;
    }

    await this.magazineLikeCoreService.deleteMagazineLikeByIdx(
      magazineIdx,
      loginUser.idx,
    );
  }
}
