import { BookmarkCoreService } from './bookmark-core.service';
import { BookmarkCoreRepository } from './bookmark-core.repository';
import { Module } from '@nestjs/common';
import { PlaceCoreModule } from '@app/core/place/place-core.module';

@Module({
  imports: [PlaceCoreModule],
  providers: [BookmarkCoreService, BookmarkCoreRepository],
  exports: [BookmarkCoreService],
})
export class BookmarkCoreModule {}
