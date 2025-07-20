import { RedisService } from '@libs/common/modules/redis/redis.service';
import { Injectable } from '@nestjs/common';
import { TokenIssuedBy } from '@user/common/module/login-token/constants/token-issued-by.constants';
import { IRefreshTokenStorage } from '@user/common/module/login-token/storage/refresh-token-storage.interface';
import { RefreshTokenPayload } from '@user/common/module/login-token/types/RefreshTokenPayload';

@Injectable()
export class RedisStorageProvider implements IRefreshTokenStorage {
  constructor(private readonly redisService: RedisService) {}

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

  public async removeRefreshTokenById(
    userIdx: number,
    refreshTokenId: string,
    issuedBy: TokenIssuedBy,
  ): Promise<void> {
    const HASH_KEY = this.getHashKey(userIdx);
    const FIELD_KEY = this.getFieldKey(issuedBy, refreshTokenId);

    await this.redisService.hdel(HASH_KEY, FIELD_KEY);
  }

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
