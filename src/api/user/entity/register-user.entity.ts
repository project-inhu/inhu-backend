import { PickType } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { User } from '@prisma/client';

/**
 * 소셜 로그인 후 사용자 조회 및 등록 시 사용자의 고유 idx가 반환되는 엔티티
 *
 * @author 조희주
 */
export class RegisterUserEntity extends PickType(UserEntity, ['idx'] as const) {
  constructor(data: RegisterUserEntity) {
    super();
    Object.assign(this, data);
  }

  static createEntityFromPrisma(user: User): RegisterUserEntity {
    return new RegisterUserEntity({
      idx: user.idx,
    });
  }
}
