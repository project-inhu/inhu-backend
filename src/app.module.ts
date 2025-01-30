import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/module/prisma/prisma.module';
import { PlaceModule } from './api/place/place.module';
import { AuthModule } from './auth/auth.module';
import { KeywordModule } from './api/keyword/keyword.module';
import { ConfigModule } from '@nestjs/config';
import { KeywordModule } from './api/keyword/keyword.module';

@Module({
  imports: [
    PrismaModule,
    PlaceModule,
    KeywordModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
