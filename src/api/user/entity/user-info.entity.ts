import { PickType } from '@nestjs/mapped-types';
import { UserEntity } from './user.entity';

/**
 * 사용자 정보 엔티티
 *
 * @author 조희주
 */
export class UserInfoEntity extends PickType(UserEntity, [
  'idx',
  'nickname',
  'profileImagePath',
  'createdAt',
  'deletedAt',
] as const) {
  constructor(partial: Partial<UserInfoEntity>) {
    super(partial);
  }
}
