import { MagazineCoreService } from '@libs/core/magazine/magazine-core.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MagazineEntity } from './entity/magazine.entity';
import { BookmarkCoreService } from '@libs/core/bookmark/bookmark-core.service';
import { LoginUser } from '@user/common/types/LoginUser';
import { MagazineOverviewEntity } from './entity/magazine-overview.entity';
import { GetAllMagazineDto } from './dto/request/get-all-magazine.dto';
import { Transactional } from '@nestjs-cls/transactional';
import { GetAllMagazineResponseDto } from './dto/response/get-all-magazine-response.dto';
import { GetAllMagazineInput } from '@libs/core/magazine/inputs/get-all-magazine.input';

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

    return magazine && MagazineEntity.fromModel(magazine, bookmarkedPlaceList);
  }

  public async getMagazineAll(
    dto: GetAllMagazineDto,
  ): Promise<GetAllMagazineResponseDto> {
    const input: GetAllMagazineInput = {
      take: 10,
      skip: (dto.page - 1) * 10,
      activated: true,
      orderBy: dto.orderBy,
    };

    return {
      magazineList: (await this.magazineCoreService.getMagazineAll(input)).map(
        MagazineOverviewEntity.fromModel,
      ),
      count: await this.magazineCoreService.getMagazineCount(input),
    };
  }

  public async likeMagazineByIdx(idx: number): Promise<void> {
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);
    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${idx}`);
    }

    await this.magazineCoreService.increaseMagazineLikeCount(idx);
  }

  public async unlikeMagazineByIdx(idx: number): Promise<void> {
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);
    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${idx}`);
    }

    if (magazine.likeCount === 0) {
      return;
    }

    await this.magazineCoreService.decreaseMagazineLikeCount(idx);
  }
}
