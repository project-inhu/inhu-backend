import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { PlaceRepository } from './place.repository';
import { KeywordModule } from '../keyword/keyword.module';

@Module({
  imports: [KeywordModule],
  controllers: [PlaceController],
  providers: [PlaceService, PlaceRepository]
})
export class PlaceModule { }
