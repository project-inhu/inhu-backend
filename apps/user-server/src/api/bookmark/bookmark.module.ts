import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { PlaceCoreModule } from '@libs/core/place/place-core.module';
import { BookmarkCoreModule } from '@libs/core/bookmark/bookmark-core.module';

@Module({
  imports: [PlaceCoreModule, BookmarkCoreModule],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
