import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/module/prisma/prisma.module';
import { PlaceModule } from './api/place/place.module';
import { KeywordModule } from './api/keyword/keyword.module';

@Module({
  imports: [PrismaModule, PlaceModule, KeywordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
