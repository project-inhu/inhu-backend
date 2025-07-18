import { BookmarkCoreService } from './bookmark-core.service';
import { BookmarkCoreRepository } from './bookmark-core.repository';
import { Module } from '@nestjs/common';
import { PlaceCoreService } from '@app/core/place/place-core.service';

@Module({
  imports: [],
  providers: [BookmarkCoreService, BookmarkCoreRepository, PlaceCoreService],
  exports: [BookmarkCoreService],
})
export class BookmarkCoreModule {}
