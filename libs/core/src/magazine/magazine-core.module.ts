import { Module } from '@nestjs/common';
import { MagazineCoreRepository } from './magazine-core.repository';
import { MagazineCoreService } from './magazine-core.service';

/**
 * 매거진 코어 모듈
 *
 * @publicApi
 */
@Module({
  providers: [MagazineCoreRepository, MagazineCoreService],
  exports: [MagazineCoreService],
})
export class MagazineCoreModule {}
