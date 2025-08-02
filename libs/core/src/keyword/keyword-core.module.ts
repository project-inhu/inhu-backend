import { KeywordCoreRepository } from './keyword-core.repository';
import { KeywordCoreService } from './keyword-core.service';
import { Module } from '@nestjs/common';

/**
 * 키워드 관련 핵심 모듈
 *
 * @publicApi
 */
@Module({
  imports: [],
  providers: [KeywordCoreService, KeywordCoreRepository],
  exports: [KeywordCoreService],
})
export class KeywordCoreModule {}
