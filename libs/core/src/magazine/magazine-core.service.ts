import { Injectable } from '@nestjs/common';
import { MagazineCoreRepository } from './magazine-core.repository';
import { MagazineModel } from './model/magazine.model';
import { CreateMagazineInput } from './inputs/create-magazine.input';
import { GetAllMagazineInput } from './inputs/get-all-magazine.input';
import { MagazineOverviewModel } from './model/magazine-overview.model';
import { UpdateMagazineInput } from './inputs/update-magazine.input';

/**
 * @publicApi
 */
@Injectable()
export class MagazineCoreService {
  constructor(
    private readonly magazineCoreRepository: MagazineCoreRepository,
  ) {}

  /**
   * idx로 매거진 조회
   *
   * @author 이수인
   */
  public async getMagazineByIdx(idx: number): Promise<MagazineModel | null> {
    const magazine = await this.magazineCoreRepository.selectMagazineByIdx(idx);

    return magazine && MagazineModel.fromPrisma(magazine);
  }

  /**
   * 모든 매거진 조회
   *
   * @author 이수인
   */
  public async getMagazineAll(
    input: GetAllMagazineInput,
  ): Promise<MagazineOverviewModel[]> {
    return (await this.magazineCoreRepository.selectMagazineAll(input)).map(
      MagazineOverviewModel.fromPrisma,
    );
  }

  /**
   * 매거진 개수 조회
   *
   * @author 이수인
   */
  public async getMagazineCount(input: GetAllMagazineInput): Promise<number> {
    return await this.magazineCoreRepository.selectMagazineCount(input);
  }

  /**
   * 매거진 생성
   *
   * @author 이수인
   */
  public async createMagazine(
    input: CreateMagazineInput,
  ): Promise<MagazineModel> {
    return MagazineModel.fromPrisma(
      await this.magazineCoreRepository.insertMagazine(input),
    );
  }

  /**
   * 매거진 활성화/비활성화 업데이트
   *
   * @author 이수인
   */
  public async updateMagazineByIdx(
    idx: number,
    input: UpdateMagazineInput,
  ): Promise<void> {
    await this.magazineCoreRepository.updateMagazineByIdx(idx, input);
  }

  /**
   * 매거진 삭제
   *
   * @author 이수인
   */
  public async deleteMagazineByIdx(idx: number): Promise<void> {
    await this.magazineCoreRepository.softDeleteMagazineByIdx(idx);
  }

  /**
   * 매거진 좋아요 수 증가
   *
   * @author 이수인
   */
  public async increaseMagazineLikeCount(idx: number): Promise<void> {
    await this.magazineCoreRepository.increaseMagazineLikeCount(idx, 1);
  }

  /**
   * 매거진 좋아요 수 감소
   *
   * @author 이수인
   */
  public async decreaseMagazineLikeCount(idx: number): Promise<void> {
    await this.magazineCoreRepository.decreaseMagazineLikeCount(idx, 1);
  }

  /**
   * 매거진 조회 수 증가
   *
   * @author 이수인
   */
  public async increaseMagazineViewCount(idx: number): Promise<void> {
    await this.magazineCoreRepository.increaseMagazineViewCount(idx, 1);
  }
}
