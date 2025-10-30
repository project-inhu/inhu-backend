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
}
