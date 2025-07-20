import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { BookmarkRepository } from './bookmark.repository';
import { PlaceModule } from '../place/place.module';

@Module({
  imports: [PlaceModule],
  controllers: [BookmarkController],
  providers: [BookmarkService, BookmarkRepository],
})
export class BookmarkModule {}
