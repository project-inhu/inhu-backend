import { Module } from '@nestjs/common';
import { MagazineController } from './magazine.controller';
import { MagazineService } from './magazine.service';
import { MagazineCoreModule } from '@libs/core/magazine/magazine-core.module';
import { BookmarkCoreModule } from '@libs/core/bookmark/bookmark-core.module';

@Module({
  imports: [MagazineCoreModule, BookmarkCoreModule],
  controllers: [MagazineController],
  providers: [MagazineService],
  exports: [MagazineService],
})
export class MagazineModule {}
