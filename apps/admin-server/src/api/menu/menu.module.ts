import { MenuCoreModule, PlaceCoreModule } from '@libs/core';
import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [MenuCoreModule, PlaceCoreModule],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [],
})
export class MenuModule {}
