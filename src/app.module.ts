import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/module/prisma/prisma.module';
import { PlaceModule } from './api/place/place.module';

@Module({
  imports: [PrismaModule, PlaceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
