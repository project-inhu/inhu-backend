import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuCoreModule } from '@libs/core/menu/menu-core.module';
import { PlaceCoreModule } from '@libs/core/place/place-core.module';

@Module({
  imports: [MenuCoreModule, PlaceCoreModule],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [],
})
export class MenuModule {}
