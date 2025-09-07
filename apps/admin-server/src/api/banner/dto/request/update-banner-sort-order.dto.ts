import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class UpdateBannerSortOrderDto {
  /**
   * 드래그 드랍 후 최종 순서의 배너 idx 리스트
   *
   * @example [5, 2, 8, 1, 3]
   */
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  idxList: number[];
}
