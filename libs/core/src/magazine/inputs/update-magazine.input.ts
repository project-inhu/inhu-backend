import { PartialType } from '@nestjs/swagger';
import { CreateMagazineInput } from './create-magazine.input';

export class UpdateMagazineInput extends PartialType(CreateMagazineInput) {
  /**
   * 활성화 여부
   *
   * - true: 활성화
   * - false: 비활성화
   */
  activate?: boolean;

  /**
   * 고정 여부
   *
   * - true: 고정
   * - false: 고정 해제
   */
  pinned?: boolean;
}
