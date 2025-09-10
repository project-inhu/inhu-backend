/**
 * 사용자 정보를 담은 entity
 *
 * @author 조희주
 */

import { UserType } from '@libs/core/user/constants/user-type.enum';
import { UserModel } from '@libs/core/user/model/user.model';

export class UserEntity {
  /**
   * 사용자 고유 idx
   *
   * @example 1
   */
  idx: number;

  /**
   * 사용자 닉네임
   *
   * @example "heeju"
   */
  nickname: string;

  /**
   * 프로필 이미지 경로
   *
   * @example "/user123/profile.jpg"
   */
  profileImagePath: string | null;

  /**
   * 계정 생성일
   *
   * @example "2025-03-07T08:50:21.451Z"
   */
  createdAt: Date;

  /**
   * 권한 인증처
   *
   * @example "kakao"
   */
  provider?: string;

  /**
   * 사용자 유형
   *
   * @example "placeOwner"
   */
  type: UserType;

  constructor(data: UserEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: UserModel): UserEntity {
    return new UserEntity({
      idx: model.idx,
      nickname: model.nickname,
      profileImagePath: model.profileImagePath,
      createdAt: model.createdAt,
      provider: model.provider?.provider,
      type: model.type,
    });
  }
}
