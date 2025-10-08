import { Injectable } from '@nestjs/common';
import { MagazineCoreRepository } from './magazine-core.repository';
import { MagazineModel } from './model/magazine.model';

/**
 * @publicApi
 */
@Injectable()
export class MagazineCoreService {
  constructor(
    private readonly magazineCoreRepository: MagazineCoreRepository,
  ) {}

  public async getMagazineByIdx(idx: number): Promise<MagazineModel | null> {
    const magazine = await this.magazineCoreRepository.selectMagazineByIdx(idx);

    return magazine && MagazineModel.fromPrisma(magazine);
  }

  public async getMagazineAll(): Promise<MagazineModel[]> {
    return (await this.magazineCoreRepository.selectMagazineAll()).map(
      MagazineModel.fromPrisma,
    );
  }
}
