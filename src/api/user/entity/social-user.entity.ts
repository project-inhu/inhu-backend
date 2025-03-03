import { PickType } from '@nestjs/mapped-types';
import { UserEntity } from './user.entity';

/**
 * 소셜 로그인 사용자 정보 엔티티
 *
 * @author 조희주
 */
export class SocialUserEntity extends PickType(UserEntity, [
  'snsId',
  'provider',
] as const) {
  constructor(partial: Partial<SocialUserEntity>) {
    super(partial);
  }
}
