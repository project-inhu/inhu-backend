import { Module } from '@nestjs/common';
import { MagazineController } from './magazine.controller';
import { MagazineService } from './magazine.service';
import { MagazineCoreModule } from '@libs/core/magazine/magazine-core.module';

@Module({
  imports: [MagazineCoreModule],
  controllers: [MagazineController],
  providers: [MagazineService],
  exports: [MagazineService],
})
export class MagazineModule {}
