import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { PlaceRepository } from './place.repository';
import { KeywordModule } from '../keyword/keyword.module';
import { AuthModule } from 'src/auth/auth.module';
import { DateUtilModule } from 'src/common/module/date-util/date-util.module';

@Module({
  imports: [KeywordModule, AuthModule, DateUtilModule],
  controllers: [PlaceController],
  providers: [PlaceService, PlaceRepository],
  exports: [PlaceService, PlaceRepository],
})
export class PlaceModule {}
