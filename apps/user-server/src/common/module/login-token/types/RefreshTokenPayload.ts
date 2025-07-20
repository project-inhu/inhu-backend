import { TokenCategory } from '@user/common/module/login-token/constants/token-category.constant';
import { TokenIssuedBy } from '@user/common/module/login-token/constants/token-issued-by.constants';

export class RefreshTokenPayload {
  /**
   * User Idx
   */
  idx: number;

  /**
   * 발급처
   */
  issuedBy: TokenIssuedBy;

  /**
   * Access/Refresh Token category 해당 값으로 구분
   */
  category: TokenCategory;

  /**
   * 기타 정보
   */
  etc?: string;
}
