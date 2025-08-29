/**
 * @author 강정연
 */
export class AddressSearchMetaEntity {
  /** 검색어에 검색된 문서 수 */
  total_count: number;
  /** total_count 중 노출 가능 문서 수 */
  pageable_count: number;
  /** 현재 페이지가 마지막 페이지인지 여부 */
  is_end: boolean;
}
