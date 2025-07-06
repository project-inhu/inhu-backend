/**
 * token 저장을 위한 기본 전략(추상 클래스)으로, 공통 로직을 정의하며 각 제공자가 이를 상속하여 구현해야 함.
 *
 * @author 이수인
 */
export abstract class TokenStorageStrategy {
  /**
   * refresh token 저장
   *
   * @author 이수인
   */
  public abstract saveRefreshToken(userIdx: number, refreshToken: string): void;

  /**
   * refresh token 조회
   *
   * @author 이수인
   */
  public abstract getRefreshToken(userIdx: number): string | null;

  /**
   * Refresh Token 검증 후 새로운 Access Token 발급
   *
   * @author 이수인
   */
  public abstract regenerateAccessTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<string>;

  protected abstract isRefreshTokenInvalid(
    payload: RefreshTokenPayload,
    refreshToken: string,
  ): boolean;
}
