import { PickType } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

/**
 * 소셜 로그인 후 사용자 조회 및 등록 시 반환되는 엔티티
 *
 * @author 조희주
 */
export class RegisterUserEntity extends PickType(UserEntity, ['idx'] as const) {
  constructor(partial: Partial<RegisterUserEntity>) {
    super(partial);
  }
}
