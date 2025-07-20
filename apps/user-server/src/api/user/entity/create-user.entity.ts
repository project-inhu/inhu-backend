import { UserModel } from '@libs/core';

/**
 * 소셜 로그인 후 사용자 조회 및 등록 시 사용자의 고유 idx가 반환되는 엔티티
 *
 * @author 조희주
 */
export class CreateUserEntity {
  /**
   * 사용자 고유 idx
   *
   * @example 1
   */
  idx: number;

  constructor(data: CreateUserEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: UserModel): CreateUserEntity {
    return new CreateUserEntity({
      idx: model.idx,
    });
  }
}
