import { Module } from '@nestjs/common';
import { MagazineController } from './magazine.controller';
import { MagazineService } from './magazine.service';
import { MagazineCoreModule } from '@libs/core/magazine/magazine-core.module';
import { PlaceCoreModule } from '@libs/core/place/place-core.module';
import { OpenAIModule } from '@libs/common/modules/openAI/openAI.module';

@Module({
  imports: [MagazineCoreModule, PlaceCoreModule, OpenAIModule],
  controllers: [MagazineController],
  providers: [MagazineService],
  exports: [MagazineService],
})
export class MagazineModule {}
