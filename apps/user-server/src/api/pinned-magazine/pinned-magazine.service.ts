import { PinnedMagazineCoreService } from '@libs/core/pinned-magazine/pinned-magazine-core.service';
import { Injectable } from '@nestjs/common';
import { PinnedMagazineOverviewEntity } from './entity/pinned-magazine-overview.entity';
import { LoginUser } from '@user/common/types/LoginUser';
import { MagazineLikeCoreService } from '@libs/core/magazine-like/magazine-like-core.service';

@Injectable()
export class PinnedMagazineService {
  constructor(
    private readonly pinnedMagazineCoreService: PinnedMagazineCoreService,
    private readonly magazineLikeCoreService: MagazineLikeCoreService,
  ) {}

  public async getPinnedMagazineAll(
    loginUser?: LoginUser,
  ): Promise<PinnedMagazineOverviewEntity[]> {
    const pinnedMagazineOverviewModelList =
      await this.pinnedMagazineCoreService.getPinnedMagazineAll();

    if (!loginUser?.idx) {
      return pinnedMagazineOverviewModelList.map((magazine) =>
        PinnedMagazineOverviewEntity.fromModel(magazine, false),
      );
    }

    const magazineLikeIdxList = await this.magazineLikeCoreService
      .getMagazineLikeAllByUserIdxAndMagazineIdxList(
        loginUser.idx,
        pinnedMagazineOverviewModelList.map((magazine) => magazine.idx),
      )
      .then((likes) => likes.map((like) => like.magazineIdx));

    return pinnedMagazineOverviewModelList.map((magazine) =>
      PinnedMagazineOverviewEntity.fromModel(
        magazine,
        magazineLikeIdxList.includes(magazine.idx),
      ),
    );
  }
}
