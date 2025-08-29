import { AddressSearchDocumentEntity } from '../../entity/address-search-document.entity';
import { AddressSearchMetaEntity } from '../../entity/address-search-meta.entity';

/**
 * @author 강정연
 */
export class SearchAddressResponseDto {
  /**
   * 검색 메타 데이터
   */
  meta: AddressSearchMetaEntity;

  /**
   * 검색된 데이터들
   */
  documents: AddressSearchDocumentEntity[];
}
