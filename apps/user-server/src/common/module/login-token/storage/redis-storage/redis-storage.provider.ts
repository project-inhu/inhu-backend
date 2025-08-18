import { RedisService } from '@libs/common/modules/redis/redis.service';
import { Injectable } from '@nestjs/common';
import { TokenIssuedBy } from '@user/common/module/login-token/constants/token-issued-by.constants';
import { IRefreshTokenStorage } from '@user/common/module/login-token/storage/refresh-token-storage.interface';
import { RefreshTokenPayload } from '@user/common/module/login-token/types/RefreshTokenPayload';

/**
 * Redis를 사용한 Refresh Token 저장소 구현체
 *
 * Redis 데이터 구조:
 * - Key 패턴: "user:{userIdx}:rt"
 * - Field 패턴: "{issuedBy}-{refreshTokenId}" (예: "1-123-abc-def-uuid")
 * - Value: JSON 문자열로 변환된 RefreshTokenPayload
 *
 * {
 *   "1-123-abc-def-uuid": "{\"category\":\"REFRESH\",\"idx\":123,\"issuedBy\":1}",
 *   "0-456-ghi-jkl-uuid": "{\"category\":\"REFRESH\",\"idx\":123,\"issuedBy\":0}"
 * }
 */
@Injectable()
export class RedisStorageProvider implements IRefreshTokenStorage {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Refresh Token을 Redis에 저장
   */
  public async saveRefreshToken(
    userIdx: number,
    refreshTokenId: string,
    payload: RefreshTokenPayload,
    ageDate: number,
    issuedBy: TokenIssuedBy,
  ): Promise<void> {
    const HASH_KEY = this.getHashKey(userIdx);
    const FIELD_KEY = this.getFieldKey(issuedBy, refreshTokenId);
    const ttl = ageDate * 24 * 60 * 60;

    await this.redisService.hset(HASH_KEY, {
      [FIELD_KEY]: JSON.stringify(payload),
    });
    await this.redisService.call(
      'HEXPIRE',
      HASH_KEY,
      ttl,
      'FIELDS',
      1,
      FIELD_KEY,
    );
  }

  /**
   * Refresh Token ID로 토큰 페이로드 조회
   *
   * @returns 토큰 페이로드 또는 null
   */
  public async findRefreshTokenPayloadById(
    userIdx: number,
    refreshTokenId: string,
    issuedBy: TokenIssuedBy,
  ): Promise<RefreshTokenPayload | null> {
    const HASH_KEY = this.getHashKey(userIdx);
    const FIELD_KEY = this.getFieldKey(issuedBy, refreshTokenId);

    const result = await this.redisService.hget(HASH_KEY, FIELD_KEY);

    if (!result) {
      return null;
    }

    return JSON.parse(result) as RefreshTokenPayload;
  }

  /**
   * Refresh Token을 Redis에서 삭제
   */
  public async removeRefreshTokenById(
    userIdx: number,
    refreshTokenId: string,
    issuedBy: TokenIssuedBy,
  ): Promise<void> {
    const HASH_KEY = this.getHashKey(userIdx);
    const FIELD_KEY = this.getFieldKey(issuedBy, refreshTokenId);

    await this.redisService.hdel(HASH_KEY, FIELD_KEY);
  }

  /**
   * 특정 사용자의 모든 Refresh Token 목록 조회
   *
   * @param userIdx 사용자 ID
   * @returns 토큰 ID와 발급처 정보 배열
   * @example [{id: "abc-def-uuid", issuedBy: 1}, {id: "ghi-jkl-uuid", issuedBy: 0}]
   */
  public async findRefreshTokenIdListByUserIdx(userIdx: number): Promise<
    {
      id: string;
      issuedBy: TokenIssuedBy;
    }[]
  > {
    const HASH_KEY = this.getHashKey(userIdx);

    return await this.redisService.hkeys(HASH_KEY).then((keys) => {
      return keys.map((key) => {
        const [issuedBy, ...str] = key.split('-');
        return {
          id: str.join('-'),
          issuedBy: Number(issuedBy) as TokenIssuedBy,
        };
      });
    });
  }

  private getHashKey(userIdx: number): string {
    return `user:${userIdx}:rt`;
  }

  private getFieldKey(issuedBy: TokenIssuedBy, refreshTokenId: string): string {
    return `${issuedBy}-${refreshTokenId}`;
  }
}
