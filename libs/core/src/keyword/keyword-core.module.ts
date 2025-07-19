import { KeywordCoreRepository } from './keyword-core.repository';
import { KeywordCoreService } from './keyword-core.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [KeywordCoreService, KeywordCoreRepository],
  exports: [KeywordCoreService],
})
export class KeywordCoreModule {}
