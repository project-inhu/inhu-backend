import { Module } from '@nestjs/common';
import { MagazineLikeController } from './magazine-like.controller';
import { MagazineLikeService } from './magazine-like.service';
import { MagazineLikeCoreModule } from '@libs/core/magazine-like/magazine-like-core.module';
import { MagazineCoreModule } from '@libs/core/magazine/magazine-core.module';

@Module({
  imports: [MagazineLikeCoreModule, MagazineCoreModule],
  controllers: [MagazineLikeController],
  providers: [MagazineLikeService],
  exports: [MagazineLikeService],
})
export class MagazineLikeModule {}
