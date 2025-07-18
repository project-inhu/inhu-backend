import { BookmarkCoreService } from './bookmark-core.service';
import { BookmarkCoreRepository } from './bookmark-core.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [BookmarkCoreService, BookmarkCoreRepository],
  exports: [],
})
export class BookmarkCoreModule {}
