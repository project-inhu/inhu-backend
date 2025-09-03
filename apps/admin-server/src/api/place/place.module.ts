import { PlaceController } from '@admin/api/place/place.controller';
import { PlaceService } from '@admin/api/place/place.service';
import { PlaceCoreModule } from '@libs/core/place/place-core.module';
import { Module } from '@nestjs/common';
import { KakaoAddressModule } from '@libs/modules/kakao-address/kakao-address.module';

@Module({
  imports: [PlaceCoreModule, KakaoAddressModule],
  controllers: [PlaceController],
  providers: [PlaceService],
  exports: [],
})
export class PlaceModule {}
