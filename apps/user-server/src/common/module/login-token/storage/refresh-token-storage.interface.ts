import { TokenIssuedBy } from '@user/common/module/login-token/constants/token-issued-by.constants';
import { RefreshTokenPayload } from '@user/common/module/login-token/types/RefreshTokenPayload';

export abstract class IRefreshTokenStorage {
  public abstract saveRefreshToken(
    userIdx: number,
    refreshTokenId: string,
    payload: RefreshTokenPayload,
    ageDate: number,
    issuedBy: TokenIssuedBy,
  ): Promise<void>;

  public abstract findRefreshTokenPayloadById(
    userIdx: number,
    refreshTokenId: string,
    issuedBy: TokenIssuedBy,
  ): Promise<RefreshTokenPayload | null>;

  public abstract removeRefreshTokenById(
    userIdx: number,
    refreshTokenId: string,
    issuedBy: TokenIssuedBy,
  ): Promise<void>;

  public abstract findRefreshTokenIdListByUserIdx(userIdx: number): Promise<
    {
      id: string;
      issuedBy: TokenIssuedBy;
    }[]
  >;
}
