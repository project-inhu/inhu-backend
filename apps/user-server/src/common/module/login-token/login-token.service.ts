import { UserModel } from '@libs/core/user/model/user.model';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenCategory } from '@user/common/module/login-token/constants/token-category.constant';
import { TokenIssuedBy } from '@user/common/module/login-token/constants/token-issued-by.constants';
import { InvalidAccessTokenException } from '@user/common/module/login-token/exception/invalid-access-token.exception';
import { InvalidRefreshTokenException } from '@user/common/module/login-token/exception/invalid-refresh-token.exception';
import { IRefreshTokenStorage } from '@user/common/module/login-token/storage/refresh-token-storage.interface';
import { AccessTokenPayload } from '@user/common/module/login-token/types/AccessTokenPayload';
import { RefreshTokenPayload } from '@user/common/module/login-token/types/RefreshTokenPayload';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoginTokenService {
  private readonly APP_REFRESH_TOKEN_AGE_DATES: number;
  private readonly WEB_REFRESH_TOKEN_AGE_DATES: number;
  private readonly ACCESS_TOKEN_AGE_MINUTES: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenStorage: IRefreshTokenStorage,
  ) {
    const config = this.configService.get('loginJwt');

    this.APP_REFRESH_TOKEN_AGE_DATES = config.APP_REFRESH_TOKEN_AGE_DATES;
    this.WEB_REFRESH_TOKEN_AGE_DATES = config.WEB_REFRESH_TOKEN_AGE_DATES;
    this.ACCESS_TOKEN_AGE_MINUTES = config.ACCESS_TOKEN_AGE_MINUTES;
  }

  /**
   * 로그인 토큰 세트 발급하기
   * access token과 refresh token을 발급합니다.
   */
  public async issueTokenSet(
    user: Pick<UserModel, 'idx'>,
    issuedBy: TokenIssuedBy,
  ) {
    const { refreshToken, refreshTokenId, payload } =
      await this.issueRefreshToken(user, issuedBy);

    const accessToken = await this.issueAccessToken(refreshTokenId, payload);

    return {
      accessToken,
      refreshToken,
      refreshTokenId,
    };
  }

  /**
   * refresh token 무효화 시키기
   *
   * @param id - refresh token의 id
   */
  public async invalidateRefreshTokenById(
    userIdx: number,
    refreshTokenId: string,
    issuedBy: TokenIssuedBy,
  ): Promise<void> {
    await this.refreshTokenStorage.removeRefreshTokenById(
      userIdx,
      refreshTokenId,
      issuedBy,
    );
  }

  /**
   * refresh token verify 하기
   */
  public async verifyRefreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenPayload & { jti: string }> {
    const payload = await this.onlyVerifyRefreshToken(refreshToken);

    const refreshTokenId = payload.jti;
    const userIdx = payload.idx;
    const issuedBy = payload.issuedBy;

    const refreshTokenPayload =
      await this.refreshTokenStorage.findRefreshTokenPayloadById(
        userIdx,
        refreshTokenId,
        issuedBy,
      );

    if (!refreshTokenPayload) {
      throw new InvalidRefreshTokenException('refresh token not found');
    }

    return payload;
  }

  /**
   * refresh token으로 access token을 발급하는 함수입니다.
   */
  public async reissueAccessToken(refreshToken: string): Promise<{
    accessToken: string;
  }> {
    const payload = await this.verifyRefreshToken(refreshToken);

    const accessToken = await this.issueAccessToken(payload.jti, payload);

    return {
      accessToken,
    };
  }

  /**
   * access token verify 하기
   */
  public async verifyAccessToken(
    accessToken: string,
  ): Promise<AccessTokenPayload> {
    const payload = await this.onlyVerifyAccessToken(accessToken);

    const result = await this.refreshTokenStorage.findRefreshTokenPayloadById(
      payload.idx,
      payload.id,
      payload.issuedBy,
    );

    if (!result) {
      throw new InvalidRefreshTokenException('refresh token not found');
    }

    return payload;
  }

  private async onlyVerifyAccessToken(
    accessToken: string,
  ): Promise<AccessTokenPayload> {
    try {
      return await this.jwtService.verifyAsync<AccessTokenPayload>(accessToken);
    } catch (err) {
      throw new InvalidAccessTokenException('invalid access token');
    }
  }

  /**
   * refresh token verify만 해서 payload을 반환하는 함수입니다.
   */
  private async onlyVerifyRefreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenPayload & { jti: string }> {
    try {
      return await this.jwtService.verifyAsync<
        RefreshTokenPayload & { jti: string }
      >(refreshToken);
    } catch (err) {
      throw new InvalidRefreshTokenException('invalid refresh token');
    }
  }

  /**
   * Access Token 발급하기
   */
  private async issueAccessToken(
    refreshTokenId: string,
    refreshTokenPayload: RefreshTokenPayload,
  ) {
    const payload: AccessTokenPayload = {
      idx: refreshTokenPayload.idx,
      category: TokenCategory.ACCESS,
      issuedBy: refreshTokenPayload.issuedBy,
      id: refreshTokenId,
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: this.ACCESS_TOKEN_AGE_MINUTES + 'm',
    });
  }

  /**
   * Refresh Token 발급하기
   */
  private async issueRefreshToken(
    { idx: userIdx }: Pick<UserModel, 'idx'>,
    issuedBy: TokenIssuedBy,
  ): Promise<{
    refreshToken: string;
    refreshTokenId: string;
    payload: RefreshTokenPayload;
  }> {
    const payload: RefreshTokenPayload = {
      category: TokenCategory.REFRESH,
      idx: userIdx,
      issuedBy: issuedBy,
    };

    const result =
      await this.refreshTokenStorage.findRefreshTokenIdListByUserIdx(userIdx);

    if (issuedBy === TokenIssuedBy.APP) {
      const alreadyExistAppToken = result.find(
        (token) => token.issuedBy === TokenIssuedBy.APP,
      );

      if (alreadyExistAppToken) {
        await this.refreshTokenStorage.removeRefreshTokenById(
          userIdx,
          alreadyExistAppToken.id,
          TokenIssuedBy.APP,
        );
      }
    }

    if (issuedBy === TokenIssuedBy.WEB) {
      const alreadyExistWebTokenList = result.filter(
        (token) => token.issuedBy === TokenIssuedBy.WEB,
      );

      if (alreadyExistWebTokenList.length >= 3) {
        const oldestWebToken = alreadyExistWebTokenList[0];
        await this.refreshTokenStorage.removeRefreshTokenById(
          userIdx,
          oldestWebToken.id,
          TokenIssuedBy.WEB,
        );
      }
    }

    const jwtId = userIdx + '-' + uuidv4();

    const expiresIn = TokenIssuedBy.APP
      ? this.APP_REFRESH_TOKEN_AGE_DATES
      : this.WEB_REFRESH_TOKEN_AGE_DATES;

    await this.refreshTokenStorage.saveRefreshToken(
      userIdx,
      jwtId,
      payload,
      expiresIn,
      issuedBy,
    );

    return {
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: expiresIn + 'd',
        jwtid: jwtId,
      }),
      refreshTokenId: jwtId,
      payload,
    };
  }
}
