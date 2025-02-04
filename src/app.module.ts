import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/module/prisma/prisma.module';
import { PlaceModule } from './api/place/place.module';
import { UserModule } from './api/user/user.module';
import { HeejuAuthModule } from './api/heeju_auth/heeju_auth.module';

@Module({
  imports: [PrismaModule, PlaceModule, UserModule, HeejuAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
