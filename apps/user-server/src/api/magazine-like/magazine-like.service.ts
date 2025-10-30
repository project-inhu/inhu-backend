import { MagazineLikeCoreService } from '@libs/core/magazine-like/magazine-like-core.service';
import { MagazineCoreService } from '@libs/core/magazine/magazine-core.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MagazineLikeEntity } from './entity/magazine-like.entity';
import { LoginUser } from '@user/common/types/LoginUser';

@Injectable()
export class MagazineLikeService {
  constructor(
    private readonly magazineLikeCoreService: MagazineLikeCoreService,
    private readonly magazineCoreService: MagazineCoreService,
  ) {}

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
      loginUser.idx,
      magazineIdx,
    );
  }
}
