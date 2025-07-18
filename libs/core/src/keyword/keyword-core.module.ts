import { KeywordCoreRepository } from '@app/core/keyword/keyword-core.repository';
import { KeywordCoreService } from '@app/core/keyword/keyword-core.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [KeywordCoreService, KeywordCoreRepository],
  exports: [KeywordCoreService],
})
export class KeywordCoreModule {}
