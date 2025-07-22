import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { BookmarkCoreModule, PlaceCoreModule } from '@libs/core';

@Module({
  imports: [PlaceCoreModule, BookmarkCoreModule],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
