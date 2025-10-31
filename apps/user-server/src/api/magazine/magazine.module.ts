import { Module } from '@nestjs/common';
import { MagazineController } from './magazine.controller';
import { MagazineService } from './magazine.service';
import { MagazineCoreModule } from '@libs/core/magazine/magazine-core.module';
import { BookmarkCoreModule } from '@libs/core/bookmark/bookmark-core.module';
import { MagazineLikeCoreModule } from '@libs/core/magazine-like/magazine-like-core.module';

@Module({
  imports: [MagazineCoreModule, BookmarkCoreModule, MagazineLikeCoreModule],
  controllers: [MagazineController],
  providers: [MagazineService],
  exports: [MagazineService],
})
export class MagazineModule {}
