import { KeywordCoreRepository } from './keyword-core.repository';
import { Injectable } from '@nestjs/common';
import { KeywordModel } from './model/keyword.model';

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
}
