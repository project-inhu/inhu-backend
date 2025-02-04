import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/module/prisma/prisma.module';
import { PlaceModule } from './api/place/place.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './heeju-auth/auth/auth.module';

@Module({
  imports: [PrismaModule, PlaceModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
