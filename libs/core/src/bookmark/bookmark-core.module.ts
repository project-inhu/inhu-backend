import { BookmarkCoreService } from './bookmark-core.service';
import { BookmarkCoreRepository } from './bookmark-core.repository';
import { Module } from '@nestjs/common';
import { PlaceCoreModule } from '@libs/core/place/place-core.module';

/**
 * 북마크 관련 핵심 모듈
 *
 * @publicApi
 */
@Module({
  imports: [PlaceCoreModule],
  providers: [BookmarkCoreService, BookmarkCoreRepository],
  exports: [BookmarkCoreService],
})
export class BookmarkCoreModule {}
