import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MagazineLikeCoreRepository } from './magazine-like-core.repository';
import { MagazineLikeModel } from './model/magazine-like.model';
import { Prisma } from '@prisma/client';

@Injectable()
export class MagazineLikeCoreService {
  constructor(
    private readonly magazineLikeCoreRepository: MagazineLikeCoreRepository,
  ) {}

  /**
   * 사용자가 특정 매거진에 좋아요를 눌렀는지 여부를 조회
   *
   * @author 이수인
   */
  public async getMagazineLikeByIdx(
    userIdx: number,
    magazineIdx: number,
  ): Promise<MagazineLikeModel | null> {
    const userMagazineLike =
      await this.magazineLikeCoreRepository.selectMagazineLikeByIdx(
        userIdx,
        magazineIdx,
      );

    return userMagazineLike && MagazineLikeModel.fromPrisma(userMagazineLike);
  }

  /**
   * 사용자가 좋아요한 모든 매거진을 조회
   *
   * @author 이수인
   */
  public async getMagazineLikeAllByUserIdxAndMagazineIdxList(
    userIdx: number,
    magazineIdxList: number[],
  ): Promise<MagazineLikeModel[]> {
    return (
      await this.magazineLikeCoreRepository.selectMagazineLikeAllByUserIdxAndMagazineIdxList(
        userIdx,
        magazineIdxList,
      )
    ).map(MagazineLikeModel.fromPrisma);
  }

  /**
   * 매거진 좋아요 등록
   *
   * @author 이수인
   */
  public async createMagazineLikeByIdx(
    magazineIdx: number,
    userIdx: number,
  ): Promise<MagazineLikeModel> {
    try {
      return MagazineLikeModel.fromPrisma(
        await this.magazineLikeCoreRepository.insertMagazineLikeByIdx(
          magazineIdx,
          userIdx,
        ),
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Magazine like already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  /**
   * 매거진 좋아요 삭제
   *
   * @author 이수인
   */
  public async deleteMagazineLikeByIdx(
    magazineIdx: number,
    userIdx: number,
  ): Promise<void> {
    try {
      await this.magazineLikeCoreRepository.deleteMagazineLikeByIdx(
        magazineIdx,
        userIdx,
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new ConflictException('Magazine like does not exist');
      }
      throw new InternalServerErrorException();
    }
  }
}
