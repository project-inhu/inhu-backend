import { MenuCoreModule } from '@libs/core/menu/menu-core.module';
import { Module } from '@nestjs/common';
import { MenuController } from '@user/api/menu/menu.controller';
import { MenuService } from '@user/api/menu/menu.service';

@Module({
  imports: [MenuCoreModule],
  providers: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}
