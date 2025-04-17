import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { BookmarkRepository } from './bookmark.repository';
import { PlaceModule } from '../place/place.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, PlaceModule],
  controllers: [BookmarkController],
  providers: [BookmarkService, BookmarkRepository],
})
export class BookmarkModule {}
