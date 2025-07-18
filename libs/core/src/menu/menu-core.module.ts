import { Module } from '@nestjs/common';
import { MenuCoreService } from './menu-core.service';
import { MenuCoreRepository } from './menu-core.repository';

@Module({
  imports: [],
  providers: [MenuCoreService, MenuCoreRepository],
  exports: [MenuCoreService],
})
export class MenuCoreModule {}
