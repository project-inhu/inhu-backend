import { Injectable } from '@nestjs/common';
import { PinnedMagazineCoreRepository } from './pinned-magazine-core.repository';
import { PinnedMagazineModel } from './model/pinned-magazine.model';
import { PinnedMagazineOverviewModel } from './model/pinned-magazine-overview.model';

@Injectable()
export class PinnedMagazineCoreService {
  constructor(
    private readonly pinnedMagazineCoreRepository: PinnedMagazineCoreRepository,
  ) {}

  public async getPinnedMagazineByIdx(
    idx: number,
  ): Promise<PinnedMagazineModel | null> {
    const pinnedMagazine =
      await this.pinnedMagazineCoreRepository.selectPinnedMagazineByIdx(idx);

    return pinnedMagazine
      ? PinnedMagazineModel.fromPrisma(pinnedMagazine)
      : null;
  }

  public async getPinnedMagazineAll(): Promise<PinnedMagazineOverviewModel[]> {
    return (
      await this.pinnedMagazineCoreRepository.selectPinnedMagazineAll()
    ).map((pinnedMagazine) =>
      PinnedMagazineOverviewModel.fromPrisma(pinnedMagazine),
    );
  }

  public async createPinnedMagazineByIdx(
    magazineIdx: number,
  ): Promise<PinnedMagazineModel> {
    return PinnedMagazineModel.fromPrisma(
      await this.pinnedMagazineCoreRepository.insertPinnedMagazineByIdx(
        magazineIdx,
      ),
    );
  }

  public async deletePinnedMagazineByIdx(magazineIdx: number): Promise<void> {
    await this.pinnedMagazineCoreRepository.deletePinnedMagazineIdx(
      magazineIdx,
    );
  }
}
