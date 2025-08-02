import { KeywordCoreRepository } from './keyword-core.repository';
import { Injectable } from '@nestjs/common';
import { KeywordModel } from './model/keyword.model';
import { CreateKeywordInput } from './inputs/create-keyword.input';
import { UpdateKeywordInput } from './inputs/update-keyword.input';

/**
 * 키워드 관련 핵심 서비스
 *
 * @publicApi
 */
@Injectable()
export class KeywordCoreService {
  constructor(private readonly keywordCoreRepository: KeywordCoreRepository) {}

  public async getKeywordByIdx(idx: number): Promise<KeywordModel | null> {
    const keyword = await this.keywordCoreRepository.selectKeywordByIdx(idx);

    return keyword && KeywordModel.fromPrisma(keyword);
  }

  public async getKeywordAll(): Promise<KeywordModel[]> {
    return (await this.keywordCoreRepository.selectKeywordAll()).map(
      KeywordModel.fromPrisma,
    );
  }

  public async createKeyword(input: CreateKeywordInput): Promise<KeywordModel> {
    return KeywordModel.fromPrisma(
      await this.keywordCoreRepository.insertKeyword(input),
    );
  }

  public async updateKeywordByIdx(
    idx: number,
    input: UpdateKeywordInput,
  ): Promise<void> {
    return await this.keywordCoreRepository.updateKeywordByIdx(idx, input);
  }

  public async deletedKeywordByIdx(idx: number): Promise<void> {
    return await this.keywordCoreRepository.softDeleteKeywordByIdx(idx);
  }
}
